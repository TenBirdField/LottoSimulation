// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // 기본 번호 생성 함수
    const generateNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return [...numbers].sort((a, b) => a - b);
    };

    // 당첨 번호 생성
    const generateWinningNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        let bonus;
        do {
            bonus = Math.floor(Math.random() * 45) + 1;
        } while (numbers.has(bonus));

        return {
            mainNumbers: [...numbers].sort((a, b) => a - b),
            bonusNumber: bonus
        };
    };

    // 당첨 여부 체크 함수
    const checkWinningRank = (numbers) => {
        const matchCount = numbers.filter(num =>
            winningNumbers.mainNumbers.includes(num)
        ).length;
        const hasBonusNumber = numbers.includes(winningNumbers.bonusNumber);

        if (matchCount === 6) return 1;
        if (matchCount === 5 && hasBonusNumber) return 2;
        if (matchCount === 5) return 3;
        if (matchCount === 4) return 4;
        if (matchCount === 3) return 5;
        return 0;
    };

    // 등수 표시 텍스트
    const getRankText = (rank) => {
        if (rank === 0) return '';
        return `${rank}등`;
    };

    // 등수에 따른 색상
    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return '#FF0000';
            case 2: return '#FF6B00';
            case 3: return '#FFB800';
            case 4: return '#4CAF50';
            case 5: return '#2196F3';
            default: return '#000000';
        }
    };

    // 상태 관리
    const [winningNumbers, setWinningNumbers] = useState(generateWinningNumbers());
    const [amount, setAmount] = useState('');
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulations, setSimulations] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [rankAnimations, setRankAnimations] = useState([]);
    const [statistics, setStatistics] = useState({
        rank1: 0,
        rank2: 0,
        rank3: 0,
        rank4: 0,
        rank5: 0,
        totalWinAmount: 0
    });

    // 번호 변경 효과
    useEffect(() => {
        let timer;
        let interval;
        let speed = 1000;
        let currentSpeed = 1000;

        const startRolling = () => {
            if (!isRolling) return;

            const updateSimulationsAndAmount = () => {
                setSimulations(prev => {
                    const newSimulations = prev.map(() => generateNumbers());

                    newSimulations.forEach((numbers, index) => {
                        const rank = checkWinningRank(numbers);
                        if (rank > 0) {
                            const id = Date.now() + index;
                            setRankAnimations(prev => [...prev, {
                                id,
                                rank,
                                index,
                                top: index * 61 + 8
                            }]);

                            setTimeout(() => {
                                setRankAnimations(prev => prev.filter(anim => anim.id !== id));
                            }, 2000);

                            // 통계 업데이트
                            setStatistics(prev => {
                                const newStats = { ...prev };
                                newStats[`rank${rank}`]++;

                                // 당첨금 계산
                                let winAmount = 0;
                                switch (rank) {
                                    case 1: winAmount = 2000000000; break;
                                    case 2: winAmount = 30000000; break;
                                    case 3: winAmount = 3000000; break;
                                    case 4: winAmount = 50000; break;
                                    case 5: winAmount = 5000; break;
                                }
                                newStats.totalWinAmount += winAmount;

                                return newStats;
                            });
                        }
                    });

                    return newSimulations;
                });
                setTotalAmount(prev => prev + 5000);
            };

            interval = setInterval(updateSimulationsAndAmount, currentSpeed);
        };

        if (isRolling) {
            startRolling();

            timer = setTimeout(() => {
                currentSpeed = 800;
                clearInterval(interval);
                startRolling();

                setTimeout(() => {
                    currentSpeed = 600;
                    clearInterval(interval);
                    startRolling();

                    setTimeout(() => {
                        currentSpeed = 600;
                        clearInterval(interval);
                        startRolling();

                        setTimeout(() => {
                            currentSpeed = 400;
                            clearInterval(interval);
                            startRolling();

                            setTimeout(() => {
                                currentSpeed = 200;
                                clearInterval(interval);
                                startRolling();

                                setTimeout(() => {
                                    currentSpeed = 100;
                                    clearInterval(interval);
                                    startRolling();

                                    setTimeout(() => {
                                        currentSpeed = 25;
                                        clearInterval(interval);
                                        startRolling();
                                    }, 600);
                                }, 600);
                            }, 400);
                        }, 300);
                    }, 200);
                }, 100);
            }, 50);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [isRolling, winningNumbers]);

    const handleStart = () => {
        if (!isUnlimited && (parseInt(amount) < 1000 || !amount)) {
            alert('최소 1,000원 이상 입력해주세요.');
            return;
        }
        setIsSimulating(true);
        setSimulations(Array(5).fill(null).map(() => generateNumbers()));
        setIsRolling(true);
        setTotalAmount(0);
        setStatistics({
            rank1: 0,
            rank2: 0,
            rank3: 0,
            rank4: 0,
            rank5: 0,
            totalWinAmount: 0
        });
    };

    const handleStop = () => {
        setIsRolling(false);
    };

    const handleResume = () => {
        setIsRolling(true);
    };

    return (
        <div className="container">
            <h1>로또 시뮬레이터</h1>

            <div className="numbers-container">
                {winningNumbers.mainNumbers.map((number, index) => (
                    <div key={index} className="number">
                        {number}
                    </div>
                ))}
                <div className="bonus-number">
                    {winningNumbers.bonusNumber}
                </div>
            </div>

            {!isSimulating ? (
                <>
                    <div className="input-container">
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={isUnlimited}
                            placeholder="금액 입력 (최소 1,000원)"
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={isUnlimited}
                                onChange={(e) => setIsUnlimited(e.target.checked)}
                            />
                            무제한
                        </label>
                    </div>
                    <button onClick={handleStart}>시뮬레이터 시작</button>
                </>
            ) : (
                <div className="simulation-container">
                    <h2 className="result-title">결과</h2>
                    <div className="rows-container">
                        {simulations.map((numbers, index) => (
                            <div
                                key={index}
                                className="simulated-row fade-in"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {numbers.map((number, numIndex) => (
                                    <div
                                        key={numIndex}
                                        className={`number ${winningNumbers.mainNumbers.includes(number) ? 'match' : ''}`}
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {rankAnimations.map(({ id, rank, top }) => (
                            <div
                                key={id}
                                className="floating-rank"
                                style={{
                                    top: `${top}px`,
                                    color: getRankColor(rank)
                                }}
                            >
                                {getRankText(rank)}
                            </div>
                        ))}
                    </div>

                    <div className="total-amount">
                        총 사용 금액: {totalAmount.toLocaleString()}원
                    </div>

                    <div className="statistics-container">
                        <h3>당첨 통계</h3>
                        <div className="statistics-row">5등 : {statistics.rank5}회</div>
                        <div className="statistics-row">4등 : {statistics.rank4}회</div>
                        <div className="statistics-row">3등 : {statistics.rank3}회</div>
                        <div className="statistics-row">2등 : {statistics.rank2}회</div>
                        <div className="statistics-row">1등 : {statistics.rank1}회</div>
                        <div className="statistics-row win-amount">
                            당첨된 금액 : {statistics.totalWinAmount.toLocaleString()}원
                        </div>
                    </div>

                    <div className="button-container">
                        {isRolling ? (
                            <button onClick={handleStop} className="stop-button">
                                정지
                            </button>
                        ) : (
                            <button onClick={handleResume} className="resume-button">
                                재개
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;