// ========== Đọc dữ liệu ==========
let rhymeData = null;

async function loadData() {
    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error('Không thể tải data.json');
        rhymeData = await res.json();
        console.log('✅ Đã tải dữ liệu thanh – vần');
    } catch (err) {
        console.error('❌ Lỗi tải dữ liệu:', err);
        document.getElementById('poemContent').innerHTML =
            '<span style="color:#c0392b;">⚠️ Không tải được data.json. Kiểm tra file cùng thư mục.</span>';
    }
}

// ========== Tiện ích ==========
function pickRandom(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

const TONES = ['khác', 'huyền', 'hỏi', 'ngã', 'sắc', 'nặng'];
const BANG = ['khác', 'huyền'];
const TRAC = ['hỏi', 'ngã', 'sắc', 'nặng'];

function isBang(tone) { return BANG.includes(tone); }
function isTrac(tone) { return TRAC.includes(tone); }

function getAvailableRhymes() {
    if (!rhymeData) return [];
    return Object.keys(rhymeData);
}

function getRhymesWithTone(tone) {
    const rhymes = getAvailableRhymes();
    return rhymes.filter(r => rhymeData[r] && rhymeData[r][tone] && rhymeData[r][tone].length > 0);
}

// Lấy một âm tiết: ưu tiên vần + thanh, nếu không có thì thử vần khác cùng thanh
function getSyllable(rhyme, tone) {
    if (!rhymeData) return null;
    if (rhyme && rhymeData[rhyme] && rhymeData[rhyme][tone] && rhymeData[rhyme][tone].length > 0) {
        return pickRandom(rhymeData[rhyme][tone]);
    }
    const candidates = getRhymesWithTone(tone);
    if (candidates.length > 0) {
        const fallbackRhyme = pickRandom(candidates);
        return pickRandom(rhymeData[fallbackRhyme][tone]);
    }
    const fallbackTone = pickRandom(BANG);
    const fallbackRhymes = getRhymesWithTone(fallbackTone);
    if (fallbackRhymes.length > 0) {
        const fr = pickRandom(fallbackRhymes);
        return pickRandom(rhymeData[fr][fallbackTone]);
    }
    return null;
}

// Tạo một câu với mảng thanh yêu cầu (tonePattern) và vần cuối (nếu có)
function generateLineWithTones(tonePattern, rhymeForLast = null, toneForLast = null) {
    if (rhymeForLast && toneForLast) {
        if (!rhymeData[rhymeForLast] || !rhymeData[rhymeForLast][toneForLast] || rhymeData[rhymeForLast][toneForLast].length === 0) {
            rhymeForLast = null;
            toneForLast = null;
        }
    }

    const syllables = [];
    for (let i = 0; i < tonePattern.length; i++) {
        const requiredTone = tonePattern[i];
        let syl = null;
        if (i === tonePattern.length - 1 && rhymeForLast && toneForLast) {
            syl = getSyllable(rhymeForLast, toneForLast);
            if (!syl) syl = getSyllable(null, toneForLast);
        } else {
            let tone = requiredTone;
            if (tone === 'B') tone = pickRandom(BANG);
            else if (tone === 'T') tone = pickRandom(TRAC);
            else tone = pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        syllables.push(syl || '?');
    }
    return syllables.join(' ');
}

// ========== Hàm tạo từng thể loại ==========

// --- Lục bát (đã sửa: tiếng 6 và 8 câu bát luôn là thanh bằng) ---
function generateLucBat() {
    const rhymeBang = pickRandom(getRhymesWithTone('khác')) || pickRandom(getRhymesWithTone('huyền'));
    if (!rhymeBang) return '⚠️ Không có vần bằng.';
    const toneBang = pickRandom(BANG);

    // Câu lục
    const patternLuc = ['*', 'B', '*', 'T', '*', 'B'];
    let luc = [];
    for (let i = 0; i < 6; i++) {
        let required = patternLuc[i];
        let syl;
        if (i === 5) {
            syl = getSyllable(rhymeBang, toneBang);
            if (!syl) syl = getSyllable(null, toneBang);
        } else {
            const tone = (required === 'B') ? pickRandom(BANG) :
                         (required === 'T') ? pickRandom(TRAC) :
                         pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        luc.push(syl || '?');
    }
    const cauLuc = luc.join(' ');

    // Câu bát: vần ở tiếng 6 hoặc 8 (OR), nhưng cả hai đều phải là thanh bằng
    const vầnỞTiếng6 = Math.random() < 0.5;
    const patternBat = ['*', 'B', '*', 'T', '*', 'B', '*', 'B']; // vị trí 6 và 8 là B
    let bat = [];
    for (let i = 0; i < 8; i++) {
        let required = patternBat[i];
        let syl;
        if (i === 5 && vầnỞTiếng6) {
            // Vần ở tiếng 6: phải là thanh bằng
            const tone6 = pickRandom(BANG); // sửa: chỉ lấy thanh bằng
            syl = getSyllable(rhymeBang, tone6);
            if (!syl) syl = getSyllable(null, tone6);
        } else if (i === 7 && !vầnỞTiếng6) {
            // Vần ở tiếng 8: thanh bằng
            syl = getSyllable(rhymeBang, toneBang);
            if (!syl) syl = getSyllable(null, toneBang);
        } else {
            // Các vị trí khác, bao gồm i===5 (nếu không vần) và i===7 (nếu vần ở tiếng 6)
            // thì vẫn phải tuân theo pattern: B hoặc T hoặc *
            const tone = (required === 'B') ? pickRandom(BANG) :
                         (required === 'T') ? pickRandom(TRAC) :
                         pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        bat.push(syl || '?');
    }
    const cauBat = bat.join(' ');
    return `${cauLuc}\n${cauBat}`;
}

// --- Song thất lục bát (giữ nguyên, nhưng cũng có thể kiểm tra tương tự) ---
function generateSongThatLucBat() {
    const rhymeTrac = pickRandom(getRhymesWithTone('sắc')) || pickRandom(getRhymesWithTone('hỏi')) ||
                      pickRandom(getRhymesWithTone('ngã')) || pickRandom(getRhymesWithTone('nặng'));
    if (!rhymeTrac) return '⚠️ Không có vần trắc cho song thất.';
    const toneTrac = pickRandom(TRAC);

    let that1 = [];
    for (let i = 0; i < 7; i++) {
        let syl;
        if (i === 4) {
            syl = getSyllable(rhymeTrac, toneTrac);
            if (!syl) syl = getSyllable(null, toneTrac);
        } else {
            const tone = pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        that1.push(syl || '?');
    }
    const cauThat1 = that1.join(' ');

    let that2 = [];
    for (let i = 0; i < 7; i++) {
        let syl;
        if (i === 6) {
            syl = getSyllable(rhymeTrac, toneTrac);
            if (!syl) syl = getSyllable(null, toneTrac);
        } else {
            const tone = pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        that2.push(syl || '?');
    }
    const cauThat2 = that2.join(' ');

    const rhymeBang = pickRandom(getRhymesWithTone('khác')) || pickRandom(getRhymesWithTone('huyền'));
    if (!rhymeBang) return '⚠️ Không có vần bằng cho lục bát.';
    const toneBang = pickRandom(BANG);

    const patternLuc = ['*', 'B', '*', 'T', '*', 'B'];
    let luc = [];
    for (let i = 0; i < 6; i++) {
        let required = patternLuc[i];
        let syl;
        if (i === 5) {
            syl = getSyllable(rhymeBang, toneBang);
            if (!syl) syl = getSyllable(null, toneBang);
        } else {
            const tone = (required === 'B') ? pickRandom(BANG) :
                         (required === 'T') ? pickRandom(TRAC) :
                         pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        luc.push(syl || '?');
    }
    const cauLuc = luc.join(' ');

    const patternBat = ['*', 'B', '*', 'T', '*', 'B', '*', 'B'];
    let bat = [];
    for (let i = 0; i < 8; i++) {
        let required = patternBat[i];
        let syl;
        if (i === 5) {
            // Tiếng 6 của câu bát cần vần bằng với câu lục, nhưng thanh có thể tự do? 
            // Theo luật vẫn là thanh bằng, nhưng tôi để tự do vì nếu không thì khó tìm vần.
            // Nhưng để đúng luật, tôi sẽ ép thanh bằng.
            const tone6 = pickRandom(BANG); // vẫn là bằng
            syl = getSyllable(rhymeBang, tone6);
            if (!syl) syl = getSyllable(null, tone6);
        } else if (i === 7) {
            syl = getSyllable(rhymeBang, toneBang);
            if (!syl) syl = getSyllable(null, toneBang);
        } else {
            const tone = (required === 'B') ? pickRandom(BANG) :
                         (required === 'T') ? pickRandom(TRAC) :
                         pickRandom(TONES);
            syl = getSyllable(null, tone);
        }
        bat.push(syl || '?');
    }
    const cauBat = bat.join(' ');
    return `${cauThat1}\n${cauThat2}\n${cauLuc}\n${cauBat}`;
}

// --- Thất ngôn tứ tuyệt (đã sửa luật bằng trắc) ---
function generateThatNgonTuTuyet() {
    const rhymeBang = pickRandom(getRhymesWithTone('khác')) || pickRandom(getRhymesWithTone('huyền'));
    if (!rhymeBang) return '⚠️ Không có vần bằng.';
    const toneBang = pickRandom(BANG);

    const p1 = ['*', 'T', '*', 'B', '*', 'T', '*'];
    const p2 = ['*', 'B', '*', 'T', '*', 'B', '*'];

    const lines = [];
    for (let i = 0; i < 4; i++) {
        let pattern = (i === 0 || i === 3) ? p1 : p2;
        let line;
        if (i === 0 || i === 1 || i === 3) {
            line = generateLineWithTones(pattern, rhymeBang, toneBang);
        } else {
            line = generateLineWithTones(pattern);
        }
        lines.push(line);
    }
    return lines.join('\n');
}

// --- Ngũ ngôn tứ tuyệt (đã sửa luật bằng trắc) ---
function generateNguNgonTuTuyet() {
    const rhymeBang = pickRandom(getRhymesWithTone('khác')) || pickRandom(getRhymesWithTone('huyền'));
    if (!rhymeBang) return '⚠️ Không có vần bằng.';
    const toneBang = pickRandom(BANG);

    const p1 = ['*', 'T', '*', 'B', '*'];
    const p2 = ['*', 'B', '*', 'T', '*'];

    const lines = [];
    for (let i = 0; i < 4; i++) {
        let pattern = (i === 0 || i === 3) ? p1 : p2;
        let line;
        if (i === 1 || i === 3) {
            line = generateLineWithTones(pattern, rhymeBang, toneBang);
        } else {
            line = generateLineWithTones(pattern);
        }
        lines.push(line);
    }
    return lines.join('\n');
}

// --- Thất ngôn bát cú (đã sửa luật bằng trắc) ---
function generateThatNgonBatCu() {
    const rhymeBang = pickRandom(getRhymesWithTone('khác')) || pickRandom(getRhymesWithTone('huyền'));
    if (!rhymeBang) return '⚠️ Không có vần bằng.';
    const toneBang = pickRandom(BANG);

    const pA = ['*', 'T', '*', 'B', '*', 'T', '*'];
    const pB = ['*', 'B', '*', 'T', '*', 'B', '*'];

    const lines = [];
    const rhymePositions = [0, 1, 3, 5, 7];
    for (let i = 0; i < 8; i++) {
        let pattern;
        if (i === 0 || i === 3 || i === 4 || i === 7) pattern = pA;
        else pattern = pB;
        let line;
        if (rhymePositions.includes(i)) {
            line = generateLineWithTones(pattern, rhymeBang, toneBang);
        } else {
            line = generateLineWithTones(pattern);
        }
        lines.push(line);
    }
    return lines.join('\n');
}

// --- Tự do (giữ nguyên) ---
function generateTuDo() {
    let lines = [];
    for (let c = 0; c < 4; c++) {
        const wordCount = Math.floor(Math.random() * 4) + 5;
        const syllables = [];
        for (let i = 0; i < wordCount; i++) {
            const tone = pickRandom(TONES);
            const syl = getSyllable(null, tone);
            syllables.push(syl || '?');
        }
        lines.push(syllables.join(' '));
    }
    return lines.join('\n');
}

// ========== Xử lý chính ==========
function generatePoem(genre) {
    if (!rhymeData) return '⏳ Đang tải dữ liệu...';
    let poem = '';
    switch (genre) {
        case 'lucbat': poem = generateLucBat(); break;
        case 'songthat_lucbat': poem = generateSongThatLucBat(); break;
        case 'thatngon_tutuyet': poem = generateThatNgonTuTuyet(); break;
        case 'thatngon_batcu': poem = generateThatNgonBatCu(); break;
        case 'ngungon_tutuyet': poem = generateNguNgonTuTuyet(); break;
        case 'tu_do': poem = generateTuDo(); break;
        default: poem = '⚠️ Thể loại chưa hỗ trợ.';
    }
    return poem;
}

// ========== Viết hoa đầu dòng ==========
function capitalizeFirstLetter(str) {
    if (!str || str.length === 0) return str;
    const match = str.match(/[a-zA-ZÀ-ỹ]/);
    if (!match) return str;
    const index = match.index;
    return str.slice(0, index) + str[index].toUpperCase() + str.slice(index + 1);
}

// ========== DOM ==========
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();

    const btn = document.getElementById('generateBtn');
    const genreSelect = document.getElementById('genre');
    const output = document.getElementById('poemContent');

    function renderPoem() {
        const genre = genreSelect.value;
        const poemText = generatePoem(genre);
        output.innerHTML = poemText
            .split('\n')
            .map(line => `<span class="line">${capitalizeFirstLetter(line)}</span>`)
            .join('');
    }

    btn.addEventListener('click', renderPoem);
    if (rhymeData) renderPoem();
});
