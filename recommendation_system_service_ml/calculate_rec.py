import json
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from sentence_transformers import SentenceTransformer
import stanza
from dataclasses import dataclass
from typing import List, Dict, Tuple
from interests_embeddings import ie

import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

interest_embeddings = ie
nlp = stanza.Pipeline('ru', processors='tokenize,ner')
model = SentenceTransformer('DeepPavlov/rubert-base-cased', device='cuda')

@dataclass
class User:
    user_id: int
    first_name: str
    last_name: str
    about_me: str
    selected_interests: List[int]
    photos: List[str]
    gender: str
    city: str
    job: str
    education: str
    age: int


def get_user_embeddings(user_selected_interests: List[int], embeddings: Dict[str, List[float]]) -> np.ndarray:
    return np.array([embeddings[str(interest_id)] for interest_id in user_selected_interests])

def calculate_interest_similarity(user1_selected_interests: List[int], user2_selected_interests: List[int]) -> float:
    user1_embeddings = get_user_embeddings(user1_selected_interests, interest_embeddings)
    user2_embeddings = get_user_embeddings(user2_selected_interests, interest_embeddings)
    user1_embeddings = normalize(user1_embeddings)
    user2_embeddings = normalize(user2_embeddings)

    similarities = [cosine_similarity([emb1], [emb2])[0][0] for emb1 in user1_embeddings for emb2 in user2_embeddings]
    return np.mean(similarities)

def extract_entities_and_embeddings(text: str) -> Tuple[Dict[str, List[str]], Dict[str, List[np.ndarray]]]:
    doc = nlp(text)
    entities = {ent_type: [] for ent_type in ["PER", "ORG", "LOC", "MISC", "GPE", "FAC", "NORP", "EVENT", "WORK_OF_ART", "LAW", "LANGUAGE"]}
    embeddings = {ent_type: [] for ent_type in ["PER", "ORG", "LOC", "MISC", "GPE", "FAC", "NORP", "EVENT", "WORK_OF_ART", "LAW", "LANGUAGE"]}

    for sentence in doc.sentences:
        for ent in sentence.ents:
            if ent.type in entities:
                entities[ent.type].append(ent.text)
                entity_embedding = model.encode([ent.text])[0]
                embeddings[ent.type].append(entity_embedding)

    return entities, embeddings

def calculate_description_similarity(user1_about_me: str, user2_about_me: str) -> float:
    entities1, embeddings1 = extract_entities_and_embeddings(user1_about_me)
    entities2, embeddings2 = extract_entities_and_embeddings(user2_about_me)

    all_similarities = []
    for category in entities1:
        category1 = entities1[category]
        embeddings1_category = embeddings1.get(category, [])
        
        category2 = entities2.get(category, [])
        embeddings2_category = embeddings2.get(category, [])

        for ent1, emb1 in zip(category1, embeddings1_category):
            for ent2, emb2 in zip(category2, embeddings2_category):
                similarity = cosine_similarity([emb1], [emb2])[0][0]
                all_similarities.append(similarity)

    return np.mean(all_similarities) if all_similarities else 0.0

def calculate_total_relevance(interest_similarity: float, description_similarity: float) -> float:
    return 0.8 * interest_similarity + 0.2 * description_similarity

def compare_users(user1: User, user2: User) -> float:
    interest_similarity = calculate_interest_similarity(user1.selected_interests, user2.selected_interests)
    description_similarity = calculate_description_similarity(user1.about_me, user2.about_me)
    return calculate_total_relevance(interest_similarity, description_similarity)

def compare_user_with_group(user: User, users: List[User]) -> List[User]:
    relevance_scores = []
    for other_user in users:
        if user.user_id != other_user.user_id:
            relevance_score = compare_users(user, other_user)
            relevance_scores.append((other_user, relevance_score))
    sorted_users = sorted(relevance_scores, key=lambda x: x[1], reverse=True)
    logger.info(sorted_users)
    return [user for user, _ in sorted_users] 
