export default class Comments {
  constructor(data) {
    this.comments = data;
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': this.date,
      'emotion': this.emotion,
    };
  }

  static parseComment(data) {
    return new Comments(data);
  }

  static parseComments(data) {
    return data.map(Comments.parseComment);
  }

  static clone(data) {
    return new Comments(data.toRAW());
  }
}
