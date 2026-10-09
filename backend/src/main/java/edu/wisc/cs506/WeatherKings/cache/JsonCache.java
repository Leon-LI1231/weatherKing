package edu.wisc.cs506.WeatherKings.cache;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;

/**
 * Small Redis-backed JSON cache for the application layer.
 *
 * Values are stored as JSON strings with a TTL. Every operation fails open: if Redis is
 * disabled or unreachable the cache simply behaves as empty, so the API keeps working
 * (just without the speedup).
 */
@Component
public class JsonCache {

    private final StringRedisTemplate redis;
    private final ObjectMapper mapper;
    private final boolean enabled;

    public JsonCache(StringRedisTemplate redis, ObjectMapper mapper,
                     @Value("${cache.enabled:true}") boolean enabled) {
        this.redis = redis;
        this.mapper = mapper;
        this.enabled = enabled;
    }

    public <T> Optional<T> get(String key, TypeReference<T> type) {
        if (!enabled) {
            return Optional.empty();
        }
        try {
            String json = redis.opsForValue().get(key);
            return json == null ? Optional.empty() : Optional.of(mapper.readValue(json, type));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void put(String key, Object value, Duration ttl) {
        if (!enabled) {
            return;
        }
        try {
            redis.opsForValue().set(key, mapper.writeValueAsString(value), ttl);
        } catch (Exception e) {
            // fail open
        }
    }

    public void evict(String key) {
        if (!enabled) {
            return;
        }
        try {
            redis.delete(key);
        } catch (Exception e) {
            // fail open
        }
    }
}
