<?php

abstract class APP_GameAction extends APP_Action
{
    /**
     * @var \${Game}
     */
    protected $game;

    /**
     * @param \${Game} $game
     */
    public function stubGame(\${Game} $game)
    {
        $this->game = $game;
    }

    /**
     * @return \${Game}
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * @param int $activePlayerId
     * @return self
     */
    public function stubActivePlayerId($activePlayerId)
    {
        return $this;
    }

    protected static function ajaxResponse($dummy = '')
    {
        if ($dummy != '') {
            throw new InvalidArgumentException("Game action cannot return any data");
        }
    }
}