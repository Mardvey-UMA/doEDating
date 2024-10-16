package com.example.demo.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return props;
    }

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return props;
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        return new DefaultKafkaConsumerFactory<>(consumerConfigs());
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }

    // Топики для каждой операции
    @Bean
    public NewTopic registerTopic() {
        return new NewTopic("register-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic registerResponseTopic() {
        return new NewTopic("register-response-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userAuthTopic() {
        return new NewTopic("user-auth-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userAuthResponseTopic() {
        return new NewTopic("user-auth-response-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userGetListTopic() {
        return new NewTopic("user-get-list-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userGetListResponseTopic() {
        return new NewTopic("user-get-list-response-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userGetByIdTopic() {
        return new NewTopic("user-get-by-id-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userGetByIdResponseTopic() {
        return new NewTopic("user-get-by-id-response-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userUpdateTopic() {
        return new NewTopic("user-update-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userUpdateResponseTopic() {
        return new NewTopic("user-update-response-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userDeleteTopic() {
        return new NewTopic("user-delete-topic", 1, (short) 1);
    }

    @Bean
    public NewTopic userDeleteResponseTopic() {
        return new NewTopic("user-delete-response-topic", 1, (short) 1);
    }
}
