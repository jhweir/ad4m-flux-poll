import { PerspectiveProxy } from "@coasys/ad4m";
import { useSubjects } from "@coasys/ad4m-react-hooks";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "preact/hooks";
import styles from "../Plugin.module.css";
import Poll from "../subjects/Poll";

type Props = {
  perspective: PerspectiveProxy;
  source: string;
};

export default function PollView({ perspective, source }: Props) {
  const { entries: polls, repo } = useSubjects({
    perspective,
    source,
    subject: Poll,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answersLocked, setAnswersLocked] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState<any[]>([
    "safdasdf",
    "asdfwes",
    "ldieksd",
  ]);
  const [titleError, setTitleError] = useState("");
  const [answersError, setAnswersError] = useState("");
  const colorScale = useRef(
    d3
      .scaleSequential()
      .domain([0, answers.length])
      .interpolator(d3.interpolateViridis)
  );

  function addAnswer() {
    if (!newAnswer) setAnswersError("Required");
    else {
      // if valid
      setAnswersError("");
      const newAnswers = [...answers, newAnswer];
      colorScale.current = d3
        .scaleSequential()
        .domain([0, newAnswers.length])
        .interpolator(d3.interpolateViridis);
      setAnswers(newAnswers);
      setNewAnswer("");
    }
  }

  function removeAnswer(index) {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    colorScale.current = d3
      .scaleSequential()
      .domain([0, newAnswers.length])
      .interpolator(d3.interpolateViridis);
    setAnswers(newAnswers);
  }

  async function createPoll() {
    // validate
    setTitleError(title ? "" : "Required");
    const answersValid = !answersLocked || answers.length > 2;
    setAnswersError(
      answersValid ? "" : "At least 2 answers required for locked polls"
    );
    // if valid
    if (title && answersValid) {
      console.log("vl.aid poll!");
      // // create poll
      // const poll = await repo.create({
      //   type: "poll",
      //   title,
      //   description,
      //   answersLocked,
      // });
      //   .then(() => {
      //     setTitle("");
      //     setDescription("");
      //   })
      //   .catch(console.log);

      // create answers

      // links answers to poll
      // const addLinks = await perspective.addLinks([
      //   {
      //     source: replyMessage.id,
      //     predicate: REPLY_TO,
      //     target: message.id,
      //   },
      //   {
      //     source: replyMessage.id,
      //     predicate: EntryType.Message,
      //     target: message.id,
      //   },
      // ]);

      // reset modal state
    }
  }

  // function toggleTodo({ id, done }) {
  //   repo.update(id, { done }).catch(console.log);
  // }

  function deletePoll(id: string) {
    repo.remove(id).catch(console.log);
  }

  useEffect(() => {
    // update modalOpen state when modal toggled shut
    const modal = document.querySelector("j-modal");
    modal.addEventListener("toggle", (e) => {
      if (!(e.target as any).open) setModalOpen(false);
    });
  }, []);

  return (
    <div>
      <j-box pt="900" pb="400">
        <j-text uppercase size="300" weight="800" color="primary-500">
          Polls
        </j-text>
      </j-box>
      <j-button variant="primary" onClick={() => setModalOpen(true)}>
        New Poll
      </j-button>

      <j-modal open={modalOpen}>
        <j-box p="500">
          <j-box pb="500">
            <j-text variant="heading-sm">New poll</j-text>
          </j-box>

          <j-box pb="600">
            <j-input
              label="Title"
              value={title}
              onChange={(e) =>
                setTitle((e.target as HTMLTextAreaElement).value)
              }
              errortext={titleError}
              error={!!titleError}
            ></j-input>
          </j-box>

          <j-box pb="400">
            <j-input
              label="Description (optional)"
              value={description}
              onChange={(e) =>
                setDescription((e.target as HTMLTextAreaElement).value)
              }
            ></j-input>
          </j-box>

          <j-box pb="400">
            <j-toggle
              checked={!answersLocked}
              onChange={() => setAnswersLocked(!answersLocked)}
            >
              Allow other users to add answers
            </j-toggle>
          </j-box>

          <j-box pb="600">
            <j-flex gap="500">
              <j-input
                label="New Answer"
                value={newAnswer}
                onChange={(e) =>
                  setNewAnswer((e.target as HTMLTextAreaElement).value)
                }
                errortext={answersError}
                error={!!answersError}
                style={{ width: "100%" }}
              ></j-input>
              <j-button onClick={addAnswer} style={{ marginTop: 26 }}>
                Add Answer
              </j-button>
              {/* <j-button square>
              <j-icon name="plus"></j-icon>
            </j-button> */}
            </j-flex>
          </j-box>

          <j-box pb="600">
            {answers.map((answer, index) => (
              <div className={styles.answer}>
                <div
                  className={styles.index}
                  style={{ backgroundColor: colorScale.current(index) }}
                >
                  {index + 1}
                </div>
                <j-text size="500" nomargin>
                  {answer}
                </j-text>
                <j-button square style={{ marginLeft: "var(--j-space-400)" }}>
                  <j-icon
                    name="trash"
                    onClick={() => removeAnswer(index)}
                  ></j-icon>
                </j-button>
              </div>
              // <j-box p="500" radius="md">
              //   {answer}
              // </j-box>
            ))}
          </j-box>

          <j-button variant="primary" onClick={createPoll}>
            Create Poll
          </j-button>
        </j-box>
      </j-modal>

      <j-box pt="500">
        <j-flex gap="300" direction="column">
          {polls.map((poll) => (
            <j-box p="400" radius="md">
              <j-flex j="between">
                <div>
                  <j-text size="500" nomargin>
                    {poll.title}
                  </j-text>
                  <j-text size="500" nomargin>
                    {poll.description}
                  </j-text>
                  {/* <j-checkbox
                    onChange={
                      (e) => toggleTodo({ id: poll.id, done: poll.done }) // e.target.checked })
                    }
                    checked={poll.done}
                    // style="--j-border-radius: 50%;"
                    size="sm"
                  >
                    <j-icon slot="checkmark" size="xs" name="check"></j-icon>
                    <j-text size="500" nomargin>
                      {poll.title}
                    </j-text>
                    <j-text size="500" nomargin>
                      {poll.desc}
                    </j-text>
                  </j-checkbox> */}
                </div>
                <j-button onClick={() => deletePoll(poll.id)}>Delete</j-button>
              </j-flex>
            </j-box>
          ))}
        </j-flex>
      </j-box>
    </div>
  );
}
