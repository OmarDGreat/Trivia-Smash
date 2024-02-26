useEffect(() => {
    if (selectedAnswer && !hasScoreUpdated) {
      console.log(`Answer selected: ${selectedAnswer}`);
      if (selectedAnswer === questions[currentQuestionIndex].answer) {
        setScore((prevScore) => prevScore + timer * 100);
        console.log(`Score updated to: ${score + timer * 100}`);
      }
  
      console.log('Setting timeout to move to next question...');
      const timeoutId = setTimeout(() => {
        console.log('Timeout completed, setting trigger for next question...');
        setTriggerNextQuestion(true);
        setHasScoreUpdated(true); // Update the flag here after the timeout
      }, 1000);
  
      return () => {
        console.log('Clearing timeout...');
        clearTimeout(timeoutId);
      };
    }
  }, [selectedAnswer, hasScoreUpdated, currentQuestionIndex, questions, timer]);
  