class State {
  constructor() {
    this.state = {}
  }

  setState(stateAtom) {
    const nextState = Object.assign({}, this.state, stateAtom)
    this.stateWillUpdate(nextState)
    this.state = nextState
  }

  stateWillUpdate(nextState) {}
}

module.exports = State
