
-- Drop the questions table if it exists
DROP TABLE IF EXISTS questions;

-- Create the questions table with answers as JSONB
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    answers JSONB NOT NULL,  -- Change to JSONB for storing the answers
    viewed BOOLEAN DEFAULT FALSE,
    review BOOLEAN DEFAULT FALSE,
    correct_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into the questions table with answers as JSONB
INSERT INTO questions (question_text, answers, viewed, review, correct_index) VALUES
('What is the capital of France?', '["Berlin", "Madrid", "Paris", "Rome"]', FALSE, FALSE, 3),
('What is 2 + 2?', '["3", "4", "5", "6"]', FALSE, FALSE, 2),
('What is the largest planet in our solar system?', '["Earth", "Jupiter", "Mars", "Saturn"]', FALSE, FALSE, 2),
('What is the chemical symbol for water?', '["H2O", "O2", "CO2", "NaCl"]', FALSE, FALSE, 1),
('Who wrote "Hamlet"?', '["Charles Dickens", "William Shakespeare", "Leo Tolstoy", "Mark Twain"]', FALSE, FALSE, 2),
('What is the square root of 16?', '["2", "4", "8", "10"]', FALSE, FALSE, 2),
('Which ocean is the largest?', '["Atlantic", "Indian", "Arctic", "Pacific"]', FALSE, FALSE, 4),
('What is the fastest land animal?', '["Cheetah", "Lion", "Tiger", "Horse"]', FALSE, FALSE, 1),
('What is the boiling point of water?', '["100 degrees Celsius", "90 degrees Celsius", "110 degrees Celsius", "120 degrees Celsius"]', FALSE, FALSE, 1),
('Who painted the Mona Lisa?', '["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"]', FALSE, FALSE, 3),
('What is the largest mammal?', '["Elephant", "Blue Whale", "Giraffe", "Great White Shark"]', FALSE, FALSE, 2),
('What is the capital of Japan?', '["Tokyo", "Seoul", "Beijing", "Bangkok"]', FALSE, FALSE, 1),
('What is the main ingredient in guacamole?', '["Tomato", "Avocado", "Onion", "Pepper"]', FALSE, FALSE, 2),
('How many continents are there?', '["5", "6", "7", "8"]', FALSE, FALSE, 3),
('What is the smallest country in the world?', '["Monaco", "Vatican City", "San Marino", "Liechtenstein"]', FALSE, FALSE, 2),
('Who discovered penicillin?', '["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Isaac Newton"]', FALSE, FALSE, 1),
('What is the currency of the United States?', '["Dollar", "Euro", "Yen", "Pound"]', FALSE, FALSE, 1),
('What is the largest desert in the world?', '["Sahara", "Arabian", "Gobi", "Antarctic"]', FALSE, FALSE, 4),
('Which planet is known as the Red Planet?', '["Earth", "Mars", "Jupiter", "Venus"]', FALSE, FALSE, 2),
('What is the hardest natural substance on Earth?', '["Diamond", "Gold", "Iron", "Platinum"]', FALSE, FALSE, 1);
