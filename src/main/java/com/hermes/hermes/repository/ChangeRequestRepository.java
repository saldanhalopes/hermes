package com.hermes.hermes.repository;

import com.hermes.hermes.model.ChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, Long> {
    long countByStatus(com.hermes.hermes.model.ChangeStatus status);

    java.util.Optional<ChangeRequest> findByCmNumber(String cmNumber);

    java.util.List<ChangeRequest> findByCmNumberIn(java.util.List<String> cmNumbers);

    @Query("SELECT COUNT(c) FROM ChangeRequest c WHERE c.changeType = :type")
    long countByType(@Param("type") String type);

    @Query(value = "SELECT EXTRACT(MONTH FROM created_at) as month_val, COUNT(*) as count " +
                   "FROM change_requests " +
                   "WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                   "GROUP BY month_val " +
                   "ORDER BY month_val", nativeQuery = true)
    java.util.List<Object[]> countByMonthCurrentYear();
}
