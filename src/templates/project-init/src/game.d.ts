interface ${Game}
   extends ebg.core.gamegui,
      BgaGame<${Game}PlayerData, ${Game}Gamedatas> {
   dontPreloadImage(image_file_name: string): void;
   ensureSpecificGameImageLoading(image_file_names_array: string[]);
   displayScoring(
      anchor_id: string,
      color: string,
      score: number,
      duration: number,
      offset_x?: number,
      offset_y?: number,
   ): void;
   fadeOutAndDestroy(id: string, duration?: number, delay?: number): void;
   showMessage(msg: string, type: 'info' | 'error' | 'only_to_log'): void;
   updatePlayerOrdering(): void;
   removeActionButtons: () => void;
   addTooltip(
      nodeId: string,
      helpStringTranslated: string,
      actionStringTranslated: string,
      delay?: number,
   ): void;
   addTooltipHtmlToClass(cssClass: string, html: string, delay?: number): void;
   gameinterface_zoomFactor: number;
}

interface ${Game}PlayerData extends BgaPlayer {

}

interface ${Game}Gamedatas extends BgaGamedatas<${Game}PlayerData> {

}

/////////////////////////////////////////////
// States
interface StateHandler {
   onEnteringState(args: any): void;
   onLeavingState(): void;
   onUpdateActionButtons(args: any): void;
}