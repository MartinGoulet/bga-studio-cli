class StateManager {
    private readonly states: { [statename: string]: StateHandler };
 
    constructor(private game: ${Game}) {
       this.states = {
          playerTurn: new PlayerTurnState(game),
       };
    }
 
    onEnteringState(stateName: string, args: any): void {
       debug('Entering state: ' + stateName);

       if (this.states[stateName] !== undefined) {
          this.states[stateName].onEnteringState(args.args);
       } else if (isDebug) {
          console.warn('State not handled', stateName);
       }
    }
 
    onLeavingState(stateName: string): void {
       debug('Leaving state: ' + stateName);
 
       if (this.states[stateName] !== undefined) {
          if (this.game.isCurrentPlayerActive()) {
             this.states[stateName].onLeavingState();
          } else if ('isMultipleActivePlayer' in this.states[stateName]) {
             this.states[stateName].onLeavingState();
          }
       }
    }
 
    onUpdateActionButtons(stateName: string, args: any): void {
       debug('onUpdateActionButtons: ' + stateName);
       if (this.states[stateName] !== undefined) {
          if (this.game.isCurrentPlayerActive()) {
             this.states[stateName].onUpdateActionButtons(args);
          } else if ('isMultipleActivePlayer' in this.states[stateName]) {
             this.states[stateName].onUpdateActionButtons(args);
          }
       }
    }
 }
 