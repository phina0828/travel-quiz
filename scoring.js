/**
 * Calculates the user's personality type based on their answers.
 * @param {Array<Object>} answers - An array of answer objects, where each object contains the 'types' array from the chosen option.
 * @returns {string} The ID of the personality type with the highest score.
 */
export function calculatePersonality(answers) {
    const scores = {
        poundcake: 0, scone: 0, strawberry: 0, pudding: 0, tiramisu: 0,
        cupcake: 0, tart: 0, lava: 0, cream: 0, chiffon: 0
    };

    answers.forEach(answer => {
        if (answer && answer.types) {
            answer.types.forEach(type => {
                if (scores.hasOwnProperty(type)) {
                    scores[type]++;
                }
            });
        }
    });

    let highestScore = -1;
    let finalType = '';
    // In case of a tie, the one that appears first in the `scores` object wins.
    // This is deterministic.
    for (const type in scores) {
        if (scores[type] > highestScore) {
            highestScore = scores[type];
            finalType = type;
        }
    }
    return finalType;
}

/**
 * Calculates the compatibility score between two users.
 * @param {Array<number>} answers1 - User 1's answers (indices of chosen options).
 * @param {Array<number>} answers2 - User 2's answers (indices of chosen options).
 * @returns {number} The compatibility score from 0 to 100.
 */
export function calculateCompatibility(answers1, answers2) {
    let matchScore = 0;
    for (let i = 0; i < answers1.length; i++) {
        if (answers1[i] === answers2[i]) {
            matchScore += 5;
        }
    }
    return matchScore;
}

/**
 * Gets the compatibility level and advice based on the score.
 * @param {number} score - The compatibility score.
 * @returns {object} An object containing the level, metaphor, and advice.
 */
export function getCompatibilityLevel(score) {
    if (score >= 90) {
        return {
            level: "完美三層蛋糕組合",
            metaphor: "婚禮蛋糕",
            advice: "超級合拍，你們是天造地設的旅行神仙眷侶，去哪都能創造快樂回憶！"
        };
    } else if (score >= 70) {
        return {
            level: "雙人下午茶組合",
            metaphor: "甜點雙拼盤",
            advice: "默契十足！你們的旅行風格很相似，只要稍微溝通，就能享受一趟和諧的旅程。"
        };
    } else if (score >= 50) {
        return {
            level: "微微裂紋的布丁組合",
            metaphor: "布丁＋司康",
            advice: "風格有些不同，但這也是互相學習的好機會。建議從短途旅行開始磨合，多點耐心溝通！"
        };
    } else if (score >= 30) {
        return {
            level: "洩氣派皮塔",
            metaphor: "鬆軟塔皮",
            advice: "你們的風格差異頗大，旅途中容易產生摩擦。試著多為對方著想，或設定一些個人時間。"
        };
    } else {
        return {
            level: "碎裂餅乾盒組合",
            metaphor: "餅乾渣",
            advice: "呃... 也許各自旅行會更快樂。友情更可貴，別讓一趟旅行毀了它！"
        };
    }
} 