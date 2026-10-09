package edu.wisc.cs506.WeatherKings;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.wisc.cs506.WeatherKings.cache.JsonCache;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class JsonCacheTest {

    private static final TypeReference<List<String>> LIST = new TypeReference<>() { };

    @Test
    @SuppressWarnings("unchecked")
    void returnsStoredValueAsParsedJson() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(ops);
        when(ops.get("k")).thenReturn("[\"a\",\"b\"]");

        var result = new JsonCache(redis, new ObjectMapper(), true).get("k", LIST);

        assertEquals(List.of("a", "b"), result.orElseThrow());
    }

    @Test
    void failsOpenWhenRedisIsDown() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        when(redis.opsForValue()).thenThrow(new IllegalStateException("redis down"));
        JsonCache cache = new JsonCache(redis, new ObjectMapper(), true);

        assertTrue(cache.get("k", LIST).isEmpty());
        cache.put("k", List.of("a"), Duration.ofSeconds(5)); // must not throw
        cache.evict("k");
    }

    @Test
    void doesNothingWhenDisabled() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        JsonCache cache = new JsonCache(redis, new ObjectMapper(), false);

        assertTrue(cache.get("k", LIST).isEmpty());
        cache.put("k", List.of("a"), Duration.ofSeconds(5));
        cache.evict("k");

        verifyNoInteractions(redis);
    }

    @Test
    @SuppressWarnings("unchecked")
    void putStoresJsonWithTtl() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        ValueOperations<String, String> ops = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(ops);

        new JsonCache(redis, new ObjectMapper(), true).put("k", List.of("a"), Duration.ofSeconds(30));

        verify(ops).set("k", "[\"a\"]", Duration.ofSeconds(30));
    }
}
