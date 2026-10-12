
import unittest
from checker import analyze_password


class TestPasswordChecker(unittest.TestCase):

    def test_empty_password(self):
        result = analyze_password("")
        self.assertIn("score", result)
        self.assertEqual(result["length"], 0)

    def test_short_password(self):
        result = analyze_password("123")
        self.assertLessEqual(result["score"], 25)

    def test_result_fields(self):
        result = analyze_password("Example!9Strong")
        for field in (
            "score",
            "strength",
            "length",
            "entropy_bits",
            "crack_time",
            "suggestions",
        ):
            self.assertIn(field, result)

    def test_score_range(self):
        result = analyze_password("Sample!Password2026")
        self.assertGreaterEqual(result["score"], 0)
        self.assertLessEqual(result["score"], 100)

    def test_length(self):
        password = "Test!Password123"
        result = analyze_password(password)
        self.assertEqual(result["length"], len(password))


if __name__ == "__main__":
    unittest.main()
