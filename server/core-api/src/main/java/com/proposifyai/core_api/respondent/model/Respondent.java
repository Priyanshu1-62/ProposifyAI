package com.proposifyai.core_api.respondent.model;

import com.proposifyai.core_api.respondent.constant.InboundEmailStatus;
import com.proposifyai.core_api.respondent.constant.InboundEvaluationStatus;
import com.proposifyai.core_api.respondent.constant.OutboundEmailStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "respondent",
        uniqueConstraints = @UniqueConstraint(columnNames = {"email", "group_id"})
)
@Getter
@Setter
public class Respondent {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "group_id", nullable = false)
    private String groupId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "outbound_status", nullable = false, columnDefinition = "outbound_email_status")
    private OutboundEmailStatus outboundStatus = OutboundEmailStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "inbound_status", nullable = false, columnDefinition = "inbound_email_status")
    private InboundEmailStatus inboundStatus = InboundEmailStatus.WAITING;

    @Enumerated(EnumType.STRING)
    @Column(name = "inbound_evaluation_status", nullable = false, columnDefinition = "inbound_evaluation_status")
    private InboundEvaluationStatus inboundEvaluationStatus = InboundEvaluationStatus.PENDING;

    public Respondent() {
    }
}
