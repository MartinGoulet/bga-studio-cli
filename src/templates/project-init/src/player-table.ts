class PlayerTable {
    public player_id: number;
 
 
    constructor(private game: ${Game}, player: ${Game}PlayerData) {
       this.player_id = Number(player.id);
 
       const html = `
         <div id="player-table-${player.id}" class="player-table whiteblock" style="--player-color: #${player.color}">
            <h3>${player.name}</h3>
         </div>`;
 
       const pos = this.player_id === game.getPlayerId() ? "afterbegin" : "beforeend";
       document.getElementById("tables").insertAdjacentHTML(pos, html);
    }
 }
 