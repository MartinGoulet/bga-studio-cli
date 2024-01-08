class PlayerTurnState implements StateHandler {
 
    constructor(private game: ${Game}) {}
 
    onEnteringState(args: PlayerTurnArgs): void {
       if (!this.game.isCurrentPlayerActive()) return;
      
    }
 
    onLeavingState(): void {
       
    }
 
    onUpdateActionButtons(args: PlayerTurnArgs): void {
       
    }
 
 }
 
 interface PlayerTurnArgs {
 }
 