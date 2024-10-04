package db

type Question struct {
	ID            int      `json:"id"`
	Question      string   `json:"question"`
	Answers       []string `json:"answers"`
	CorrectAnswer int      `json:"correctAnswer"`
	Viewed        bool     `json:"viewed"`
	Review        bool     `json:"review"`
}

// Export a dummy question
var DummyQuestion = Question{
	ID:            1,
	Question:      "What is the capital of Germany?",
	Answers:       []string{"Berlin", "Munich", "Hamburg", "Frankfurt"},
	CorrectAnswer: 0, // Index of the correct answer ("Berlin")
	Viewed:        true,
	Review:        false,
}