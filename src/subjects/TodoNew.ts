import { SDNAClass, SubjectProperty } from "@coasys/ad4m";

@SDNAClass({
  name: "TodoNew",
})
export default class TodoNew {
  @SubjectProperty({
    through: "rdf://title",
    writable: true,
    resolveLanguage: "literal",
  })
  title: string;

  // @SubjectProperty({
  //   through: "rdf://title",
  //   writable: true,
  //   // required: false,
  //   resolveLanguage: "literal",
  //   // value: ""
  //   // initial: "",
  // })
  // title: string;

  // @SubjectProperty({
  //   through: "rdf://done",
  //   writable: true,
  //   required: false,
  //   resolveLanguage: "literal",
  //   // value: false,
  //   initial: "",
  // })
  // done: string;
}
