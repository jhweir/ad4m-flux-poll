import { SDNAClass, SubjectFlag, SubjectProperty } from "@coasys/ad4m";

@SDNAClass({
  name: "Poll",
})
export default class Poll {
  @SubjectFlag({
    through: "we://entry_type",
    value: "we://has_poll",
  })
  type: string;

  @SubjectProperty({
    through: "we://title",
    writable: true,
    resolveLanguage: "literal",
  })
  title: string;

  @SubjectProperty({
    through: "we://description",
    writable: true,
    resolveLanguage: "literal",
  })
  description: string;

  @SubjectProperty({
    through: "we://answers_locked",
    writable: true,
    resolveLanguage: "literal",
  })
  answersLocked: boolean;
}
