import {
  intensityTime,
  intensityValue,
  beatTime,
  beats,
  loadRemoteUrl,
} from "./utils";
const { ccclass, property } = cc._decorator;

enum PlayStateEnum {
  PLAYING = "playing",
  PAUSE = "pause",
  END = "end",
  ERROR = "error",
}

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  NodePlay: cc.Node = null;

  @property(cc.Sprite)
  sprite: cc.Sprite = null;

  @property(cc.Label)
  lyrics: cc.Label = null;

  // 歌曲播放信息
  songMid = "0026n3hF3bJsj6";
  //   songMid = "000X26xH2d2TiD"; 0026n3hF3bJsj6
  playState = PlayStateEnum.PAUSE;
  playTime = 0;
  player = null;
  bpm = 96.189;

  // 节拍相关信息
  private beatIndex = 0; // 当前节拍索引
  private increaseValue = 0;

  private currentTime = 0;

  onLoad() {}

  time = 0;
  lyricTime = 0;

  protected start(): void {
    this.init();
  }

  audioCtx: AudioContext = null;
  init = async () => {
    if (cc.sys.isBrowser) {
    }
    this.bindEvent();
  };

  bindEvent = () => {
    this.NodePlay.on(cc.Node.EventType.TOUCH_START, this.handlePlay, this);
  };

  handlePlay = async () => {
    if (this.playState === PlayStateEnum.PAUSE) {
      this.player.play([this.songMid]);
    } else if (this.playState === PlayStateEnum.PLAYING) {
      this.player.pause();
    }
  };
  private rate = 0.0;

  update = (dt) => {
    const now = Date.now();
    this.time += dt;
    const deltaTime = (now - this.currentTime) / 1000;
    if (this.playState !== PlayStateEnum.PLAYING || !this.currentTime) {
      return;
    }
    // 节拍处理方法
    // if (deltaTime > 0.025) {
    //   this.currentTime = now;
    //   this.playTime += deltaTime;
    //   if (
    //     this.playTime > beatTime[this.beatIndex + 1] ||
    //     beatTime[this.beatIndex + 1] - this.playTime < 0.02
    //   ) {
    //     if (beats[this.beatIndex + 1] === 1) {
    //       this.rate = 0.7;
    //     } else {
    //       this.rate = 0.2;
    //     }
    //     this.beatIndex++;
    //   }

    //   this.increaseValue =
    //     this.increaseValue + (deltaTime * 0.5 + this.rate * 0.4);
    //   console.log(
    //     "当前播放时间：",
    //     this.playTime,
    //     "当前节拍:",
    //     beats[this.beatIndex + 1] === 1 ? "重拍" : "轻拍",
    //     "shader入参:",
    //     this.increaseValue
    //   );
    //   this.sprite.getMaterial(0).setProperty("time", this.increaseValue);
    // }
    // 歌曲震感处理方法
    if (deltaTime > 0.025) {
      this.currentTime = now;
      this.playTime += deltaTime;
      if (this.playTime > intensityTime[this.beatIndex + 1]) {
        this.rate = intensityValue[this.beatIndex];
        this.beatIndex++;
      }
      this.increaseValue =
        this.increaseValue + (deltaTime * 0.5 + this.rate * 0.4);
      console.log(
        "当前播放时间：",
        this.playTime,
        "当前震感:",
        this.rate,
        "shader入参:",
        this.increaseValue
      );
      this.sprite.getMaterial(0).setProperty("time", this.increaseValue);
    }
  };
}
