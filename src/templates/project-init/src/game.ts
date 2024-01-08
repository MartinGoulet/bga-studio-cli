const isDebug =
   window.location.host == 'studio.boardgamearena.com' || window.location.hash.indexOf('debug') > -1;
const debug = isDebug ? console.log.bind(window.console) : function () {};

class ${Game} implements ebg.core.gamegui {
    public gamedatas: ${Game}Gamedatas;
    public stateManager: StateManager;
    public notifManager: NotificationManager;
    public tableCenter: TableCenter;
    public playersPanels: PlayerPanel[];
    public playersTables: PlayerTable[];

    public setup(gamedatas: ${Game}Gamedatas) {
       this.stateManager = new StateManager(this);
       this.notifManager = new NotificationManager(this);
       this.tableCenter = new TableCenter(this);

       this.createPlayerTables(gamedatas);
       this.notifManager.setup();
       this.addReloadButton();
    }

    public onEnteringState(stateName: string, args: any) {
       this.stateManager.onEnteringState(stateName, args);
    }

    public onLeavingState(stateName: string) {
       this.stateManager.onLeavingState(stateName);
    }

    public onUpdateActionButtons(stateName: string, args: any) {
       this.stateManager.onUpdateActionButtons(stateName, args);
    }

    private addReloadButton() {
      // add reload Css debug button
      const parent = document.querySelector('.debug_section');
      if (parent) {
         this.addActionButton('reload_css', _('Reload CSS'), () => reloadCss(), parent, null, 'gray');
      }
    }

    private createPlayerPanels(gamedatas: ${Game}Gamedatas) {
       this.playersPanels = [];
       gamedatas.playerorder.forEach((player_id) => {
          const player = gamedatas.players[Number(player_id)];
          const panel = new PlayerPanel(this, player);
          this.playersPanels.push(panel);
       });
    }

    private createPlayerTables(gamedatas: ${Game}Gamedatas) {
       this.playersTables = [];
       gamedatas.playerorder.forEach((player_id) => {
          const player = gamedatas.players[Number(player_id)];
          const table = new PlayerTable(this, player);
          this.playersTables.push(table);
       });
    }

    public addPrimaryActionButton(id, text, callback, zone = "customActions"): void {
       if (!document.getElementById(id)) {
          this.addActionButton(id, text, callback, null, false, "blue");
       }
    }

    public addSecondaryActionButton(id, text, callback, zone = "customActions"): void {
       if (!document.getElementById(id)) {
          this.addActionButton(id, text, callback, null, false, "gray");
       }
    }

    public addDangerActionButton(id, text, callback, zone = "customActions"): void {
       if (!document.getElementById(id)) {
          this.addActionButton(id, text, callback, null, false, "red");
       }
    }

    public addActionButtonClientCancel() {
       const handleCancel = (evt: any): void => {
          evt.stopPropagation();
          evt.preventDefault();
          this.restoreGameState();
       };
       this.addSecondaryActionButton("btnCancelAction", _("Cancel"), handleCancel);
    }

    public getPlayerId(): number {
       return Number(this.player_id);
    }

    public getPlayerPanel(playerId: number): PlayerPanel {
       return this.playersPanels.find((playerPanel) => playerPanel.player_id === playerId);
    }

    public getPlayerTable(playerId: number): PlayerTable {
       return this.playersTables.find((playerTable) => playerTable.player_id === playerId);
    }

    public getCurrentPlayerPanel() {
       return this.getPlayerPanel(this.getPlayerId());
    }

    public getCurrentPlayerTable() {
       return this.getPlayerTable(this.getPlayerId());
    }

    public getOpponentsPlayerTable(): PlayerTable[] {
       const playerId = this.getPlayerId();
       return this.playersTables.filter((playerTable) => playerTable.player_id !== playerId);
    }

    private async restoreGameState() {
       this.restoreServerGameState();
    }

    public toggleButton(id: string, enabled: boolean): void {
       document.getElementById(id)?.classList.toggle("disabled", !enabled);
    }

    public takeAction(
       action: string,
       data?: any,
       onSuccess?: (result: any) => void,
       onComplete?: (is_error: boolean) => void
    ) {
       data = data || {};
       data.lock = true;
       onSuccess = onSuccess ?? function (result: any) {};
       onComplete = onComplete ?? function (is_error: boolean) {};
       this.ajaxcall(`/${game}/${game}/${action}.html`, data, this, onSuccess, onComplete);
    }

    ///////////////////////////////////////////////////
    //// Logs

    /* @Override */
    format_string_recursive(log: string, args: any) {
        try {
            if (log && args && !args.processed) {
                args.processed = true;

                if (args.card_name !== undefined) {
                    args.card_name = '<b>' + _(args.card_name) + '</b>';
                }
            }
        } catch (e) {
            console.error(log, args, 'Exception thrown', e.stack);
        }

        return this.inherited(arguments);
    }
 }
