package com.proposifyai.core_api.health.model;

import java.time.OffsetDateTime;

public record HealthBaseResponse(String status, OffsetDateTime dateTime) {
}
