class PlayerPanel {
    public player_id: number;
 
    constructor(public game: ${Game}, player: ${Game}PlayerData) {
       this.player_id = Number(player.id);
 
       const html = `<div id="player-panel-${player.id}" class="player-board-wrapper">
       </div>`;
 
       document.getElementById(`player_board_${player.id}`).insertAdjacentHTML('beforeend', html);
    }
 
 }
 