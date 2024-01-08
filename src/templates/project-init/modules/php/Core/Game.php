<?php

namespace ${Namespace}\Core;

class Game extends \APP_DbObject {

    public static function get() {
        return \${Game}::get();
    }

    public static function undoSavepoint() {
        self::get()->undoSavepoint();
    }

    public static function undoRestorePoint() {
        self::get()->undoRestorePoint();
    }
}
