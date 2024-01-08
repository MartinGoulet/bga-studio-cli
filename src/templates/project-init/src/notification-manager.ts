class NotificationManager {
    constructor(private game: ${Game}) {}
 
    setup() {
       const notifs: [string, number?][] = [
          
       ];
 
       this.setupNotifications(notifs);
 
       ["message"].forEach((eventName) => {
          this.game.notifqueue.setIgnoreNotificationCheck(
             eventName,
             (notif) => notif.args.excluded_player_id && notif.args.excluded_player_id == this.game.player_id
          );
       });
    }
 
    private setupNotifications(notifs: any) {
       notifs.forEach(([eventName, duration]) => {
          dojo.subscribe(eventName, this, (notifDetails: INotification<any>) => {
             const promise = this[`notif_${eventName}`](notifDetails.args);
             // tell the UI notification ends, if the function returned a promise
             promise?.then(() => this.game.notifqueue.onSynchronousNotificationEnd());
          });
          this.game.notifqueue.setSynchronous(eventName, duration);
       });
    }
 }
 