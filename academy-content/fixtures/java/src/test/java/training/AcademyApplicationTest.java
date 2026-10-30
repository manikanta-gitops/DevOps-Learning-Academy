package training;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class AcademyApplicationTest {
    @Test
    void healthReportsAlive() {
        assertEquals("alive", new AcademyApplication().health().get("status"));
    }
}