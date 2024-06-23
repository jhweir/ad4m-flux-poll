import { useSubjects } from "@coasys/ad4m-react-hooks";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "preact/hooks";
import styles from "../Plugin.module.css";
import Answer from "../subjects/Answer";
import AnswerCard from "./AnswerCard";
import PieChart from "./PieChart";

export default function PollCard(props: {
  perspective: any;
  poll: any;
  index: number;
  deletePoll: (id: string) => void;
  vote?: (answerId: string, voteId: string) => Promise<any>;
}) {
  const { perspective, poll, index, deletePoll, vote } = props;

  const { entries: answers } = useSubjects({
    perspective,
    source: poll.id,
    subject: Answer,
  });

  const [totalVotes, setTotalVotes] = useState(0);
  const [answersData, setAnswersData] = useState<any[]>([]);
  const colorScale = useRef(
    d3
      .scaleSequential()
      .domain([0, poll.answers.length])
      .interpolator(d3.interpolateViridis)
  );

  // todo: need to be able to collate all data from answers and votes
  useEffect(() => {
    // build visualisation data
    // count votes for each answer
    console.log("answers: ", answers);
    // Promise.all(
    //   answers.map(
    //     (answer) =>
    //       new Promise((resolve) => {
    //         const { entries: votes } = useSubjects({
    //           perspective,
    //           source: poll.id,
    //           subject: Vote,
    //         });
    //         resolve({ ...answer, totalVotes: votes.length });
    //       })
    //   )
    // )
    //   .then((data) => {
    //     setTotalVotes(
    //       data.map((a: any) => a.totalVotes).reduce((a, b) => a + b, 0)
    //     );
    //     setAnswersData(data);
    //   })
    //   .catch((error) => console.log(error));
  }, [answers]);

  return (
    <j-box p="600" className={styles.poll}>
      <j-flex j="between">
        <div>
          <j-text variant="heading-sm">{poll.title}</j-text>
          <j-text size="500">{poll.description}</j-text>
          <PieChart
            type="multiple-choice"
            pollId={poll.id}
            totalVotes={5} // totalVotes
            totalPoints={0}
            totalUsers={3}
            answers={answersData}
          />
          <j-flex gap="300" direction="column">
            {answers.map((answer, index) => (
              <AnswerCard
                perspective={perspective}
                answer={answer}
                index={index}
                color={colorScale.current(index)}
                vote={vote}
              />
            ))}
          </j-flex>
        </div>
        <j-button onClick={() => deletePoll(poll.id)}>Delete</j-button>
      </j-flex>
    </j-box>
  );
}
