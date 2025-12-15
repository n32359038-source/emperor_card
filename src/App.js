import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  get,
  remove,
  onDisconnect,
  off,
} from "firebase/database";
import {
  Crown,
  User,
  Skull,
  Trophy,
  History,
  Loader2,
  Check,
  LogOut,
  Play,
  MessageCircle,
  Hand,
  Eye,
  Users,
  Swords,
  Lock,
  Hourglass,
  MonitorPlay,
} from "lucide-react";

// ------------------------------------------------------------------
// ⚠️ Firebase Config (保持不變)
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBe1_b5RhoodzWXUMI9CCMqyv16b_zMPxQ",
  authDomain: "emperor-card.firebaseapp.com",
  databaseURL: "https://emperor-card-default-rtdb.firebaseio.com",
  projectId: "emperor-card",
  storageBucket: "emperor-card.firebasestorage.app",
  messagingSenderId: "574552249206",
  appId: "1:574552249206:web:612c20df08ea15f045e057",
  measurementId: "G-CTR3QHF53C",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ------------------------------------------------------------------
// 🔈 音效管理
// ------------------------------------------------------------------
const playSound = (type) => {
  // console.log("Playing sound:", type);
};

// ------------------------------------------------------------------
// 💥 碎裂特效組件
// ------------------------------------------------------------------
const ShatteredCard = ({ type }) => {
  const color =
    type === "E"
      ? "bg-yellow-600"
      : type === "S"
      ? "bg-stone-700"
      : "bg-blue-600";
  const shards = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    rotate: Math.random() * 360,
    tx: (Math.random() - 0.5) * 200,
    ty: (Math.random() - 0.5) * 200,
  }));

  return (
    <div className="relative w-20 h-32 md:w-28 md:h-44 flex items-center justify-center">
      {shards.map((s) => (
        <div
          key={s.id}
          className={`absolute w-6 h-6 ${color} border border-white/30 rounded-sm opacity-0`}
          style={{
            animation: `shatter 0.8s ease-out forwards`,
            "--tx": `${s.tx}px`,
            "--ty": `${s.ty}px`,
            "--rot": `${s.rotate}deg`,
          }}
        ></div>
      ))}
      <style>{`
        @keyframes shatter {
          0% { transform: translate(0,0) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ------------------------------------------------------------------
// 🎨 卡牌組件
// ------------------------------------------------------------------
const Card = ({
  type,
  onClick,
  disabled,
  isSelected,
  isFaceDown,
  isWinner,
  isLoser,
  isLocked,
}) => {
  const styles = {
    E: "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-yellow-200 text-yellow-900",
    S: "bg-gradient-to-br from-stone-600 via-stone-800 to-black border-stone-500 text-stone-200",
    C: "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 border-blue-300 text-white",
  };

  const getIcon = () => {
    if (type === "E") return <Crown size={40} strokeWidth={2.5} />;
    if (type === "S") return <Skull size={40} strokeWidth={2.5} />;
    return <User size={40} strokeWidth={2.5} />;
  };

  if (isFaceDown) {
    return (
      <div
        className={`
        relative w-20 h-32 md:w-28 md:h-44 rounded-xl shadow-2xl transition-all duration-500
        border-2 border-white/10 bg-[#1a1a2e] flex items-center justify-center overflow-hidden
        ${isSelected ? "transform -translate-y-4 shadow-white/50" : ""}
      `}
      >
        <div className="absolute inset-2 border border-white/5 rounded-lg opacity-50 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-900/40 to-transparent"></div>
        {isLocked ? (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <Lock className="text-white" size={32} />
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
              Locked
            </span>
          </div>
        ) : (
          <div className="text-4xl font-black text-white/10 select-none">?</div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-32 md:w-28 md:h-44 rounded-xl shadow-xl transition-all duration-300transform
        flex flex-col items-center justify-between p-2 select-none border-2
        ${styles[type] || styles.C}
        ${
          disabled
            ? "opacity-100 cursor-default"
            : "hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
        }
        ${
          isSelected
            ? "ring-4 ring-offset-4 ring-offset-slate-900 ring-yellow-400 scale-110 z-10 -translate-y-6"
            : ""
        }
        ${
          isWinner
            ? "ring-4 ring-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.8)] scale-110 z-20"
            : ""
        }
        ${isLoser ? "opacity-0 scale-0 duration-200" : ""} 
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-lg"></div>
      <div className="w-full flex justify-between text-xs font-bold opacity-80">
        <span>{type}</span>
        <span>{type}</span>
      </div>
      <div className="flex-1 flex items-center justify-center drop-shadow-md transform transition-transform duration-500">
        {getIcon()}
      </div>
      <div className="font-black text-lg tracking-widest uppercase opacity-90">
        {type === "E" ? "皇帝" : type === "S" ? "奴隸" : "市民"}
      </div>
    </button>
  );
};

const QUICK_CHATS = [
  "😏 準備受死吧",
  "😨 饒了我吧...",
  "👑 跪下！",
  "🤔 你在猶豫什麼？",
  "🔪 同歸於盡！",
  "👋 快點出牌",
  "🍻 來杯啤酒吧",
];

// ------------------------------------------------------------------
// 🧠 遊戲主邏輯
// ------------------------------------------------------------------
const EmperorGame = () => {
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");
  const [playerRole, setPlayerRole] = useState(null);
  const [spectatorId, setSpectatorId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [localSelection, setLocalSelection] = useState(null);
  const [committedCard, setCommittedCard] = useState(null);

  const [animPhase, setAnimPhase] = useState("idle");
  const isLeavingRef = useRef(false);

  // 用於控制觀戰者名單的顯示 (Mobile click toggle)
  const [showSpectatorList, setShowSpectatorList] = useState(false);

  useEffect(() => {
    if (roomId && playerRole) {
      const roomRef = ref(db, `rooms/${roomId}`);

      const unsubscribe = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          if (!isLeavingRef.current) {
            alert("房間已關閉");
            window.location.reload();
          }
          return;
        }

        if (data.status === "aborted" && !isLeavingRef.current) {
          alert("玩家已離開房間，遊戲強制結束");
          window.location.reload();
          return;
        }

        setGameState(data);
      });

      if (playerRole === "emperor" || playerRole === "slave") {
        const myPresenceRef = ref(db, `rooms/${roomId}/players/${playerRole}`);
        //onDisconnect(myPresenceRef).set(false);
      } else if (playerRole === "spectator" && spectatorId) {
        const specRef = ref(db, `rooms/${roomId}/spectators/${spectatorId}`);
        onDisconnect(specRef).remove();
      }

      return () => {
        off(roomRef);
        unsubscribe();
      };
    }
  }, [roomId, playerRole, spectatorId]);

  useEffect(() => {
    if (roomId && playerRole && !committedCard) {
      const saved = localStorage.getItem(
        `emperor_pending_${roomId}_${playerRole}`
      );
      if (saved) {
        try {
          setCommittedCard(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [roomId, playerRole]);

  useEffect(() => {
    if (gameState?.round) {
      setLocalSelection(null);
    }
  }, [gameState?.round]);

  useEffect(() => {
    if (!gameState || !playerRole || playerRole === "spectator") return;
    if (gameState.roundResult) return;

    const moves = gameState.moves || {};
    const currentRound = gameState.round || 1;

    if (moves.emperor === currentRound && moves.slave === currentRound) {
      const myRealUpload =
        playerRole === "emperor"
          ? gameState.empSelection
          : gameState.slvSelection;

      if (!myRealUpload && committedCard) {
        const updates = {};
        if (playerRole === "emperor") updates["/empSelection"] = committedCard;
        else updates["/slvSelection"] = committedCard;

        update(ref(db, `rooms/${roomId}`), updates).then(() => {
          setCommittedCard(null);
          localStorage.removeItem(`emperor_pending_${roomId}_${playerRole}`);
        });
      }
    }
  }, [gameState, playerRole, committedCard, roomId]);

  const generateRoomId = () =>
    Math.floor(1000 + Math.random() * 9000).toString();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => prompt("請複製房號：", roomId));
  };

  const createRoom = async () => {
    if (!nickname) return setError("請先輸入暱稱");
    setLoading(true);
    const newId = generateRoomId();
    const initialData = {
      status: "waiting",
      hostName: nickname,
      playerName: "",
      round: 1,
      players: { emperor: true, slave: false },
      spectators: {},
      moves: { emperor: 0, slave: 0 },
      empHand: ["E", "C", "C", "C", "C"].map((t, i) => ({
        id: `e-${i}`,
        type: t,
      })),
      slvHand: ["C", "C", "C", "C", "S"].map((t, i) => ({
        id: `s-${i}`,
        type: t,
      })),
      empSelection: null,
      slvSelection: null,
      chat: { emperor: "", slave: "" },
      history: [],
      winner: null,
      roundResult: null,
    };

    try {
      await set(ref(db, `rooms/${newId}`), initialData);
      setRoomId(newId);
      setPlayerRole("emperor");
    } catch (e) {
      setError("建立失敗: " + e.message);
    }
    setLoading(false);
  };

  // 🔥 改動 1: 加入為玩家 (奴隸方)
  const joinAsPlayer = async () => {
    if (!nickname) return setError("請先輸入暱稱");
    if (!inputRoomId) return setError("請輸入房號");
    setLoading(true);
    const roomRef = ref(db, `rooms/${inputRoomId}`);
    try {
      const snapshot = await get(roomRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // 只有在等待中且沒有 Slave 時才能加入
        if (data.status === "waiting" && !data.players.slave) {
          await update(roomRef, {
            playerName: nickname,
            "players/slave": true,
          });
          setRoomId(inputRoomId);
          setPlayerRole("slave");
        } else {
          setError("房間已滿或遊戲已開始，請改用觀戰模式");
        }
      } else {
        setError("找不到房間");
      }
    } catch (e) {
      setError("加入失敗: " + e.message);
    }
    setLoading(false);
  };

  // 🔥 改動 2: 加入為觀戰者 (獨立邏輯)
  const joinAsSpectator = async () => {
    if (!nickname) return setError("請先輸入暱稱");
    if (!inputRoomId) return setError("請輸入房號");
    setLoading(true);
    const roomRef = ref(db, `rooms/${inputRoomId}`);
    try {
      const snapshot = await get(roomRef);
      if (snapshot.exists()) {
        const newSpectatorId = Date.now().toString();
        await set(
          ref(db, `rooms/${inputRoomId}/spectators/${newSpectatorId}`),
          nickname
        );
        setRoomId(inputRoomId);
        setPlayerRole("spectator");
        setSpectatorId(newSpectatorId);
      } else {
        setError("找不到房間");
      }
    } catch (e) {
      setError("加入失敗: " + e.message);
    }
    setLoading(false);
  };

  const handleStartGame = async () => {
    if (playerRole !== "emperor") return;
    await update(ref(db, `rooms/${roomId}`), { status: "playing" });
  };

  const leaveRoom = async () => {
    if (!roomId || !playerRole) return;
    isLeavingRef.current = true;
    const roomRef = ref(db, `rooms/${roomId}`);

    try {
      if (playerRole === "spectator" && spectatorId) {
        await remove(ref(db, `rooms/${roomId}/spectators/${spectatorId}`));
      } else {
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const updates = {};
          updates[`players/${playerRole}`] = false;
          if (data.status !== "gameover") updates["status"] = "aborted";
          await update(roomRef, updates);

          const otherRole = playerRole === "emperor" ? "slave" : "emperor";
          if (!data.players[otherRole]) await remove(roomRef);
        }
      }
    } catch (e) {}

    localStorage.removeItem(`emperor_pending_${roomId}_${playerRole}`);
    setRoomId("");
    setGameState(null);
    setPlayerRole(null);
    setLocalSelection(null);
    setCommittedCard(null);
    setAnimPhase("idle");
    window.location.reload();
  };

  const sendChat = async (msg) => {
    if (!roomId || !playerRole || playerRole === "spectator") return;
    const updates = {};
    updates[`chat/${playerRole}`] = msg;
    await update(ref(db, `rooms/${roomId}`), updates);
    setTimeout(() => {
      set(ref(db, `rooms/${roomId}/chat/${playerRole}`), "");
    }, 3000);
  };

  const handleSelectCard = (card) => {
    if (gameState?.roundResult) return;
    setLocalSelection(card);
  };

  const confirmPlayCard = async () => {
    if (
      !gameState ||
      !playerRole ||
      !localSelection ||
      playerRole === "spectator"
    )
      return;
    if (gameState.roundResult) return;

    localStorage.setItem(
      `emperor_pending_${roomId}_${playerRole}`,
      JSON.stringify(localSelection)
    );
    setCommittedCard(localSelection);

    const updates = {};
    updates[`moves/${playerRole}`] = gameState.round || 1;

    await update(ref(db, `rooms/${roomId}`), updates);
    setLocalSelection(null);
  };

  useEffect(() => {
    if (!gameState) return;

    if (gameState.status === "gameover") {
      setAnimPhase("idle");
      return;
    }

    if (
      gameState.empSelection &&
      gameState.slvSelection &&
      !gameState.roundResult &&
      playerRole === "emperor"
    ) {
      setTimeout(resolveRound, 1000);
    }

    if (gameState.roundResult && animPhase === "idle") {
      setAnimPhase("clash");
      playSound("clash");
      setTimeout(() => {
        setAnimPhase("return");
        playSound("shatter");
      }, 400);
      setTimeout(() => {
        setAnimPhase("idle");
      }, 6000);
    }
  }, [gameState, playerRole, animPhase]);

  const resolveRound = async () => {
    const { empSelection, slvSelection, empHand, slvHand, history } = gameState;
    const eType = empSelection.type;
    const sType = slvSelection.type;
    let resultText = "",
      eWin = false,
      sWin = false,
      gameWinner = null;

    if (eType === "E" && sType === "S") {
      resultText = "奴隸刺殺皇帝！";
      sWin = true;
      gameWinner = "奴隸方";
    } else if (eType === "E" && sType === "C") {
      resultText = "皇帝斬殺市民！";
      eWin = true;
      gameWinner = "皇帝方";
    } else if (eType === "C" && sType === "S") {
      resultText = "市民制伏奴隸！";
      eWin = true;
      gameWinner = "皇帝方";
    } else {
      resultText = "平民對峙，雙方消滅";
    }

    const newEmpHand = empHand.filter((c) => c.id !== empSelection.id);
    const newSlvHand = slvHand.filter((c) => c.id !== slvSelection.id);
    if (!gameWinner) {
      if (newEmpHand.length === 0 || newSlvHand.length === 0)
        gameWinner = "平手 (牌組耗盡)";
    }

    const updates = {
      empHand: newEmpHand,
      slvHand: newSlvHand,
      roundResult: { text: resultText, eWin, sWin },
      history: [
        ...(history || []),
        { round: (history?.length || 0) + 1, eType, sType, result: resultText },
      ],
    };

    await update(ref(db, `rooms/${roomId}`), updates);

    // ⏳ 修改：6秒後清理資料並進入下一回合
    setTimeout(async () => {
      if (gameWinner) {
        await update(ref(db, `rooms/${roomId}`), {
          winner: gameWinner,
          status: "gameover",
        });
      } else {
        await update(ref(db, `rooms/${roomId}`), {
          empSelection: null,
          slvSelection: null,
          roundResult: null,
          round: (gameState.round || 1) + 1,
          moves: { emperor: 0, slave: 0 },
        });
      }
    }, 6000);
  };

  const resetGame = async () => {
    if (playerRole !== "emperor") return;
    const initialData = {
      status: "playing",
      players: { emperor: true, slave: true },
      empHand: ["E", "C", "C", "C", "C"].map((t, i) => ({
        id: `e-${i}-${Date.now()}`,
        type: t,
      })),
      slvHand: ["C", "C", "C", "C", "S"].map((t, i) => ({
        id: `s-${i}-${Date.now()}`,
        type: t,
      })),
      empSelection: null,
      slvSelection: null,
      round: 1,
      moves: { emperor: 0, slave: 0 },
      history: [],
      winner: null,
      roundResult: null,
      chat: { emperor: "", slave: "" },
    };
    setLocalSelection(null);
    setCommittedCard(null);
    setAnimPhase("idle");
    await update(ref(db, `rooms/${roomId}`), initialData);
  };

  const getSpectatorsList = () => {
    if (!gameState?.spectators) return [];
    return Object.values(gameState.spectators);
  };

  // ------------------------------------------------------------------
  // 🖥️ 畫面渲染
  // ------------------------------------------------------------------

  if (!gameState) {
    // 🔥 改動 3: 登入畫面 - 將加入按鈕分成「對戰」與「觀戰」
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-lg">
              皇帝牌
            </h1>
            <p className="text-slate-400 tracking-widest text-sm uppercase">
              Psychological Card Battle
            </p>
          </div>
          <div className="space-y-4 relative z-10">
            <button
              onClick={createRoom}
              disabled={loading || !nickname}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trophy size={20} />
              )}{" "}
              建立房間 (當關主)
            </button>
            <div className="flex items-center gap-2 py-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <div className="text-xs text-white/30 uppercase">
                Or Join Room
              </div>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="輸入你的暱稱"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center text-lg text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition placeholder-white/20"
              />
              <input
                type="text"
                placeholder="輸入房間代碼"
                maxLength={4}
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition placeholder-white/20"
              />
              <div className="flex gap-2">
                <button
                  onClick={joinAsPlayer}
                  disabled={loading || !inputRoomId || !nickname}
                  className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <Swords size={20} /> 挑戰 (玩家)
                </button>
                <button
                  onClick={joinAsSpectator}
                  disabled={loading || !inputRoomId || !nickname}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border border-white/10 hover:border-purple-500/30"
                >
                  <Eye size={20} /> 觀戰
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-center text-xs mt-2 bg-red-900/20 py-2 rounded-lg border border-red-500/20 animate-pulse">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. 等待室 (保持不變)
  if (gameState.status === "waiting") {
    const isHost = playerRole === "emperor";
    const spectators = getSpectatorsList();

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        {/* ... */}
        <button
          onClick={leaveRoom}
          className="absolute top-4 right-4 p-2 bg-red-900/50 hover:bg-red-800 rounded-full text-white/70 hover:text-white transition flex items-center gap-1 text-xs px-4 cursor-pointer"
        >
          <LogOut size={16} /> 離開
        </button>
        <h2 className="text-2xl font-bold text-gray-400 mb-6 flex items-center gap-2">
          {playerRole === "spectator"
            ? "👀 觀戰等待室"
            : isHost
            ? "👑 關主控制台"
            : "⏳ 準備室"}
        </h2>
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-md w-full relative overflow-hidden shadow-2xl">
          <div className="text-7xl font-mono font-black text-white mb-2">
            {roomId}
          </div>
          <div className="mb-6 bg-black/20 p-4 rounded-2xl flex justify-around">
            <div>
              <Crown className="text-yellow-500 mx-auto" /> {gameState.hostName}
            </div>
            <div>
              <User className="text-blue-400 mx-auto" />{" "}
              {gameState.playerName || "..."}
            </div>
          </div>
          {spectators.length > 0 && (
            <div className="mb-4 text-sm text-gray-400 bg-black/20 p-2 rounded-xl">
              <div className="text-xs uppercase tracking-widest mb-1 opacity-50">
                Spectators
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {spectators.map((name, i) => (
                  <span key={i} className="text-purple-300">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!gameState.playerName}
              className="w-full py-4 bg-green-600 text-white rounded-xl cursor-pointer"
            >
              開始對戰
            </button>
          ) : (
            <div className="text-yellow-500 animate-pulse">
              {playerRole === "spectator"
                ? "等待關主開始遊戲..."
                : "等待開始..."}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. 遊戲畫面
  const isSpectator = playerRole === "spectator";
  const myRole = isSpectator ? "emperor" : playerRole;
  const oppRole = myRole === "emperor" ? "slave" : "emperor";
  const myName =
    myRole === "emperor" ? gameState.hostName : gameState.playerName;
  const oppName =
    myRole === "emperor" ? gameState.playerName : gameState.hostName;
  const myHand = myRole === "emperor" ? gameState.empHand : gameState.slvHand;
  const oppHandLen =
    myRole === "emperor"
      ? gameState.slvHand?.length
      : gameState.empHand?.length;

  const currentRound = gameState.round || 1;
  const serverMySel =
    myRole === "emperor" ? gameState.empSelection : gameState.slvSelection;
  const serverOppSel =
    myRole === "emperor" ? gameState.slvSelection : gameState.empSelection;

  const oppHasCommitted =
    gameState.moves && gameState.moves[oppRole] === currentRound;
  const myHasCommitted =
    gameState.moves && gameState.moves[myRole] === currentRound;

  const myDisplaySel = serverMySel || (myHasCommitted ? committedCard : null);

  const hasOppCard = !!serverOppSel || !!oppHasCommitted;

  const isResolving = !!gameState.roundResult;
  const isClash = animPhase === "clash" || animPhase === "return";
  const isReturn = animPhase === "return";

  const isShowdownMoment =
    !!gameState.roundResult &&
    (animPhase === "clash" || animPhase === "return");

  const myIsLoser =
    myRole === "emperor"
      ? gameState.roundResult?.eWin === false &&
        gameState.roundResult?.sWin === true
      : gameState.roundResult?.sWin === false &&
        gameState.roundResult?.eWin === true;
  const oppIsLoser =
    myRole === "emperor"
      ? gameState.roundResult?.sWin === false &&
        gameState.roundResult?.eWin === true
      : gameState.roundResult?.eWin === false &&
        gameState.roundResult?.sWin === true;

  const showBattle = gameState.status !== "gameover";
  const spectatorList = getSpectatorsList();
  const spectatorCount = spectatorList.length;
  const canShowCard = !!gameState.roundResult || !!gameState.winner;

  return (
    <div
      className={`min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-gray-200 overflow-hidden flex flex-col font-sans`}
    >
      <style>{`
        @keyframes beer-shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-15deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-beer {
          animation: beer-shake 2s infinite ease-in-out;
        }
        @keyframes progress {
           from { width: 100%; }
           to { width: 0%; }
        }
      `}</style>

      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20 backdrop-blur-sm z-50 relative">
        <div className="flex items-center gap-2 text-yellow-500/80 font-bold">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>ROOM {roomId}</span>
        </div>

        {/* 🔥 改動 4: 觀戰者列表顯示區域 (不擁擠設計) */}
        {spectatorCount > 0 && (
          <div className="relative group">
            <button
              onClick={() => setShowSpectatorList(!showSpectatorList)}
              className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-purple-300 border border-purple-500/20 transition cursor-pointer"
            >
              <Eye size={12} /> 觀戰: {spectatorCount}
            </button>
            {/* Hover 或 Click 顯示名單 */}
            <div
              className={`absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl p-3 z-[100] transition-all duration-200 origin-top-right
                ${
                  showSpectatorList
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible"
                }
              `}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">
                目前觀眾
              </div>
              <div className="max-h-40 overflow-y-auto no-scrollbar space-y-1">
                {spectatorList.map((name, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-300 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${
              isSpectator
                ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                : myRole === "emperor"
                ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/10"
                : "border-gray-500/30 text-gray-400 bg-gray-500/10"
            }`}
          >
            {isSpectator ? (
              <MonitorPlay size={12} />
            ) : myRole === "emperor" ? (
              <Crown size={12} />
            ) : (
              <Skull size={12} />
            )}
            {isSpectator ? `你正在觀戰` : myName}
          </div>
          <button
            onClick={leaveRoom}
            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-between py-4 relative max-w-6xl mx-auto w-full px-4">
        {/* 對手區域 */}
        <div className="w-full flex flex-col items-center gap-2 transition-all relative">
          <div className="flex items-center gap-2 opacity-60 bg-black/40 px-4 py-1 rounded-full border border-white/5 relative">
            {oppRole === "emperor" ? <Crown size={14} /> : <Skull size={14} />}
            <span className="text-sm font-bold text-gray-300">
              {oppName || "(等待加入...)"}
            </span>
            <span className="text-xs font-bold tracking-widest uppercase ml-2 text-gray-500">
              剩餘 {oppHandLen} 張
            </span>
            {gameState.chat && gameState.chat[oppRole] && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl rounded-tl-none shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-bounce z-50 whitespace-nowrap font-bold border-2 border-black">
                {gameState.chat[oppRole]}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: oppHandLen || 0 }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-14 bg-gradient-to-b from-slate-700 to-slate-800 rounded border border-slate-600 shadow-lg"
              ></div>
            ))}
          </div>
        </div>

        {/* 中央戰場 */}
        <div className="flex-1 w-full flex items-center justify-center relative my-4 perspective-1000">
          {showBattle && (
            <>
              {/* 結算冷卻倒數提示 */}
              {isResolving && !gameState.winner && (
                <div className="absolute top-0 w-full max-w-xs flex flex-col items-center gap-1 z-50">
                  <div className="text-yellow-400 text-xs font-bold flex items-center gap-1 animate-pulse">
                    <Hourglass size={12} /> 下一回合準備中，請稍候...
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: "100%",
                        animation: "progress 6s linear forwards",
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {!isResolving && !gameState.winner && (
                <div className="absolute top-0 text-center w-full">
                  {oppHasCommitted ? (
                    myHasCommitted ? (
                      <span className="inline-block px-4 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-sm font-bold animate-pulse">
                        ⚔️ 雙方已鎖定！準備開牌！
                      </span>
                    ) : (
                      <span className="inline-block px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-sm font-bold animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                        ⚠️ 對方已鎖定出牌！
                      </span>
                    )
                  ) : (
                    <span className="inline-block px-4 py-1 rounded-full bg-white/5 text-white/50 text-xs tracking-[0.3em] uppercase border border-white/5">
                      {myDisplaySel
                        ? "等待對手..."
                        : isSpectator
                        ? "等待雙方出牌..."
                        : "請選擇一張牌"}
                    </span>
                  )}
                </div>
              )}

              <div
                className={`flex items-center gap-6 md:gap-24 transition-all duration-300 ease-in-out ${
                  isClash && !isReturn ? "gap-[0px] scale-110" : ""
                }`}
              >
                {/* 下方出牌 (自己/主視角) */}
                <div
                  className={`relative transition-all duration-700 ${
                    myDisplaySel
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } ${isClash && !isReturn ? "translate-x-[40px] z-10" : ""}`}
                >
                  {myDisplaySel ? (
                    <>
                      {isReturn && myIsLoser ? (
                        <ShatteredCard type={myDisplaySel.type} />
                      ) : (
                        <Card
                          type={
                            !isSpectator || canShowCard
                              ? myDisplaySel.type
                              : "C"
                          }
                          isFaceDown={isSpectator && !canShowCard && !isClash}
                          isLocked={myHasCommitted && !serverMySel}
                          isWinner={isReturn && !myIsLoser}
                          isLoser={false}
                          disabled
                        />
                      )}
                      <div
                        className={`absolute -bottom-6 w-full text-center text-[10px] font-bold text-white/30 tracking-widest ${
                          isClash ? "opacity-0" : ""
                        }`}
                      >
                        {myName}
                      </div>
                    </>
                  ) : (
                    <div className="w-20 h-32 md:w-28 md:h-44 border-2 border-dashed border-white/5 rounded-xl"></div>
                  )}
                </div>

                <div
                  className={`relative transition-opacity duration-200 ${
                    isClash ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Swords size={48} className="text-white/10" />
                </div>

                {/* 上方出牌 (對手) */}
                <div
                  className={`relative transition-all duration-700 ${
                    hasOppCard
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-10"
                  } ${isClash && !isReturn ? "-translate-x-[40px] z-10" : ""}`}
                >
                  {hasOppCard ? (
                    <>
                      {isReturn && oppIsLoser ? (
                        <ShatteredCard
                          type={serverOppSel ? serverOppSel.type : "C"}
                        />
                      ) : (
                        <Card
                          type={
                            isShowdownMoment
                              ? serverOppSel
                                ? serverOppSel.type
                                : "C"
                              : "C"
                          }
                          isFaceDown={!isShowdownMoment}
                          isLocked={oppHasCommitted && !serverOppSel}
                          isWinner={isReturn && !oppIsLoser}
                          isLoser={false}
                          disabled
                        />
                      )}
                      <div
                        className={`absolute -bottom-6 w-full text-center text-[10px] font-bold text-white/30 tracking-widest ${
                          isClash ? "opacity-0" : ""
                        }`}
                      >
                        {oppName}
                      </div>
                    </>
                  ) : (
                    <div className="w-20 h-32 md:w-28 md:h-44 border-2 border-dashed border-white/5 rounded-xl"></div>
                  )}
                </div>
              </div>

              {gameState.roundResult && isReturn && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl shadow-2xl animate-in zoom-in slide-in-from-bottom-5 duration-300">
                    <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-yellow-200 text-center drop-shadow-sm">
                      {gameState.roundResult.text}
                    </h2>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 下方區域 (手牌/聊天) */}
        <div className="w-full pb-4 relative z-40">
          {gameState.chat && gameState.chat[myRole] && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-xl rounded-bl-none shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-bounce z-50 whitespace-nowrap font-bold border-2 border-white">
              {gameState.chat[myRole]}
            </div>
          )}

          {!isSpectator && localSelection && !myDisplaySel && (
            <div className="absolute bottom-full mb-4 left-0 w-full flex justify-center z-[100] animate-in fade-in slide-in-from-bottom-4">
              <button
                onClick={confirmPlayCard}
                className={`${
                  gameState.roundResult
                    ? "opacity-50 cursor-not-allowed bg-gray-600"
                    : "hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                } text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-white/20 flex items-center gap-2 transform transition-all`}
                disabled={!!gameState.roundResult}
              >
                {gameState.roundResult ? (
                  <Hourglass size={20} className="animate-spin" />
                ) : (
                  <Hand size={20} />
                )}
                {gameState.roundResult ? "下一回合準備中..." : "確定出牌"}
              </button>
            </div>
          )}

          {!isSpectator ? (
            <>
              <div className="flex gap-2 justify-center mb-4 overflow-x-auto pb-2 px-4 no-scrollbar">
                <MessageCircle
                  size={20}
                  className="text-white/30 mr-2 shrink-0 self-center"
                />
                {QUICK_CHATS.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => sendChat(msg)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/20 rounded-full text-xs border border-white/10 transition whitespace-nowrap text-gray-300 hover:text-white cursor-pointer"
                  >
                    {msg}
                  </button>
                ))}
              </div>

              <div className="text-center mb-2 opacity-50 text-xs font-bold tracking-widest uppercase">
                Your Hand
              </div>
              <div className="flex justify-center flex-wrap gap-2 md:gap-4 px-2 min-h-[140px]">
                {myHand?.map((card) => (
                  <Card
                    key={card.id}
                    type={card.type}
                    onClick={() => !myDisplaySel && handleSelectCard(card)}
                    disabled={
                      !!myDisplaySel ||
                      isResolving ||
                      gameState.status === "gameover" ||
                      !!gameState.roundResult
                    }
                    isSelected={
                      localSelection?.id === card.id ||
                      myDisplaySel?.id === card.id
                    }
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6 bg-white/5 rounded-xl border border-white/5 mx-auto max-w-lg">
              <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                <Eye className="animate-pulse" />
                <span className="font-bold">觀戰模式</span>
              </div>
              <p className="text-sm text-gray-400">
                你正在觀看這場對決，無法進行操作。
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Game Over 畫面 (保持不變) */}
      {gameState.status === "gameover" && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-[#151520] border border-white/10 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
            <Trophy size={48} className="mx-auto mb-2 text-yellow-400" />
            <h2 className="text-4xl font-black text-white mb-2 uppercase">
              Game Over
            </h2>
            <p className="text-xl font-bold text-yellow-500 mb-6">
              {gameState.winner} 獲勝
            </p>
            <div className="bg-black/30 rounded-xl p-4 max-h-48 overflow-y-auto mb-6 text-left border border-white/5">
              <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2 sticky top-0 bg-transparent">
                <History size={12} /> 戰局回顧
              </h4>
              {gameState.history?.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-white/5 text-xs text-gray-300"
                >
                  <span className="w-6 text-gray-600">#{h.round}</span>
                  <span
                    className={
                      h.eType === "E" ? "text-yellow-500 font-bold" : ""
                    }
                  >
                    {h.eType}
                  </span>
                  <span className="text-gray-700">vs</span>
                  <span
                    className={h.sType === "S" ? "text-red-500 font-bold" : ""}
                  >
                    {h.sType}
                  </span>
                  <span className="text-gray-500 flex-1 text-right truncate pl-2">
                    {h.result}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={leaveRoom}
                className="flex-1 py-4 bg-gray-700 rounded-xl cursor-pointer"
              >
                離開
              </button>
              {playerRole === "emperor" && (
                <button
                  onClick={resetGame}
                  className="flex-1 py-4 bg-yellow-600 rounded-xl cursor-pointer"
                >
                  再來一局
                </button>
              )}
            </div>
            {playerRole !== "emperor" && (
              <div className="text-gray-500 text-sm animate-pulse mt-4">
                等待房主重新開始...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmperorGame;
