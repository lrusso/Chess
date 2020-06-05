/*
 * Copyright (c) 2017, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* minified license below  */

/* @license
 * Copyright (c) 2017, Jeff Hlywa (jhlywa@gmail.com)
 * Released under the BSD license
 * https://github.com/jhlywa/chess.js/blob/master/LICENSE
 */

var STRING_TITLE;
var STRING_CHECK;
var STRING_AIWINS;
var STRING_HUMANWINS;
var STRING_THINKING;
var STRING_ABOUT;

var userLanguage = window.navigator.userLanguage || window.navigator.language;

if (userLanguage.substring(0,2)=="es")
	{
	STRING_TITLE = "Ajedrez";
	STRING_CHECK = "JAQUE";
	STRING_AIWINS = "LA CPU GAN&Oacute;";
	STRING_HUMANWINS = "EL JUGADOR GAN&Oacute;";
	STRING_THINKING = "PENSANDO...";
	STRING_ABOUT = "Dise&ntilde;ado por www.lrusso.com";
	}
	else
	{
	STRING_TITLE = "Chess";
	STRING_CHECK = "CHECK";
	STRING_AIWINS = "CPU WINS";
	STRING_HUMANWINS = "HUMAN WINS";
	STRING_THINKING = "THINKING...";
	STRING_ABOUT = "Designed by www.lrusso.com";
	}

function showLabel(myTempTitle)
	{
	if (myTempTitle=="HIDE")
		{
		document.getElementsByClassName("gui_gamestatus")[0].style.display = "none";
		}
		else
		{
		document.getElementsByClassName("gui_gamestatus_label")[0].innerHTML = myTempTitle;
		document.getElementsByClassName("gui_gamestatus")[0].style.display = "block";
		}
	}

var thinking = false;

var Chess = function(fen) {

    /* jshint indent: false */


    var BLACK = "b";
    var WHITE = "w";

    var EMPTY = -1;

    var PAWN = "p";
    var KNIGHT = "n";
    var BISHOP = "b";
    var ROOK = "r";
    var QUEEN = "q";
    var KING = "k";

    var SYMBOLS = "pnbrqkPNBRQK";

    var DEFAULT_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    var POSSIBLE_RESULTS = ["1-0", "0-1", "1/2-1/2", "*"];

    var PAWN_OFFSETS = {
        b: [16, 32, 17, 15],
        w: [-16, -32, -17, -15]
    };

    var PIECE_OFFSETS = {
        n: [-18, -33, -31, -14,  18, 33, 31,  14],
        b: [-17, -15,  17,  15],
        r: [-16,   1,  16,  -1],
        q: [-17, -16, -15,   1,  17, 16, 15,  -1],
        k: [-17, -16, -15,   1,  17, 16, 15,  -1]
    };

    var ATTACKS = [
        20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
        0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
        0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
        0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
        0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
        0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
        0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
        0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
        0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
        20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
    ];

    var RAYS = [
        17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
        0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
        0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
        0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
        0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
        1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
        0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
        0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
        0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
        0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
        -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
    ];

    var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

    var FLAGS = {
        NORMAL: "n",
        CAPTURE: "c",
        BIG_PAWN: "b",
        EP_CAPTURE: "e",
        PROMOTION: "p",
        KSIDE_CASTLE: "k",
        QSIDE_CASTLE: "q"
    };

    var BITS = {
        NORMAL: 1,
        CAPTURE: 2,
        BIG_PAWN: 4,
        EP_CAPTURE: 8,
        PROMOTION: 16,
        KSIDE_CASTLE: 32,
        QSIDE_CASTLE: 64
    };

    var RANK_1 = 7;
    var RANK_2 = 6;
    var RANK_3 = 5;
    var RANK_4 = 4;
    var RANK_5 = 3;
    var RANK_6 = 2;
    var RANK_7 = 1;
    var RANK_8 = 0;

    var SQUARES = {
        a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
        a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
        a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
        a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
        a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
        a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
        a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
        a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };

    var ROOKS = {
        w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
            {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
        b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
            {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
    };

    var board = new Array(128);
    var kings = {w: EMPTY, b: EMPTY};
    var turn = WHITE;
    var castling = {w: 0, b: 0};
    var ep_square = EMPTY;
    var half_moves = 0;
    var move_number = 1;
    var history = [];
    var header = {};

    /* if the user passes in a fen string, load it, else default to
     * starting position
     */
    if (typeof fen === "undefined") {
        load(DEFAULT_POSITION);
    } else {
        load(fen);
    }

    function clear() {
        board = new Array(128);
        kings = {w: EMPTY, b: EMPTY};
        turn = WHITE;
        castling = {w: 0, b: 0};
        ep_square = EMPTY;
        half_moves = 0;
        move_number = 1;
        history = [];
        header = {};
        update_setup(generate_fen());
    }

    function reset() {
        load(DEFAULT_POSITION);
    }

    function load(fen) {
        var tokens = fen.split(/\s+/);
        var position = tokens[0];
        var square = 0;

        if (!validate_fen(fen).valid) {
            return false;
        }

        clear();

        for (var i = 0; i < position.length; i++) {
            var piece = position.charAt(i);

            if (piece === "/") {
                square += 8;
            } else if (is_digit(piece)) {
                square += parseInt(piece, 10);
            } else {
                var color = (piece < "a") ? WHITE : BLACK;
                put({type: piece.toLowerCase(), color: color}, algebraic(square));
                square++;
            }
        }

        turn = tokens[1];

        if (tokens[2].indexOf("K") > -1) {
            castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf("Q") > -1) {
            castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf("k") > -1) {
            castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf("q") > -1) {
            castling.b |= BITS.QSIDE_CASTLE;
        }

        ep_square = (tokens[3] === "-") ? EMPTY : SQUARES[tokens[3]];
        half_moves = parseInt(tokens[4], 10);
        move_number = parseInt(tokens[5], 10);

        update_setup(generate_fen());

        return true;
    }

    /* TODO: this function is pretty much crap - it validates structure but
     * completely ignores content (e.g. doesn't verify that each side has a king)
     * ... we should rewrite this, and ditch the silly error_number field while
     * we"re at it
     */
    function validate_fen(fen) {
        var errors = {
            0: "No errors.",
            1: "FEN string must contain six space-delimited fields.",
            2: "6th field (move number) must be a positive integer.",
            3: "5th field (half move counter) must be a non-negative integer.",
            4: "4th field (en-passant square) is invalid.",
            5: "3rd field (castling availability) is invalid.",
            6: "2nd field (side to move) is invalid.",
            7: "1st field (piece positions) does not contain 8 \'/\'-delimited rows.",
            8: "1st field (piece positions) is invalid [consecutive numbers].",
            9: "1st field (piece positions) is invalid [invalid piece].",
            10: "1st field (piece positions) is invalid [row too large].",
            11: "Illegal en-passant square",
        };

        /* 1st criterion: 6 space-seperated fields? */
        var tokens = fen.split(/\s+/);
        if (tokens.length !== 6) {
            return {valid: false, error_number: 1, error: errors[1]};
        }

        /* 2nd criterion: move number field is a integer value > 0? */
        if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) {
            return {valid: false, error_number: 2, error: errors[2]};
        }

        /* 3rd criterion: half move counter is an integer >= 0? */
        if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) {
            return {valid: false, error_number: 3, error: errors[3]};
        }

        /* 4th criterion: 4th field is a valid e.p.-string? */
        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
            return {valid: false, error_number: 4, error: errors[4]};
        }

        /* 5th criterion: 3th field is a valid castle-string? */
        if( !/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
            return {valid: false, error_number: 5, error: errors[5]};
        }

        /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
        if (!/^(w|b)$/.test(tokens[1])) {
            return {valid: false, error_number: 6, error: errors[6]};
        }

        /* 7th criterion: 1st field contains 8 rows? */
        var rows = tokens[0].split("/");
        if (rows.length !== 8) {
            return {valid: false, error_number: 7, error: errors[7]};
        }

        /* 8th criterion: every row is valid? */
        for (var i = 0; i < rows.length; i++) {
            /* check for right sum of fields AND not two numbers in succession */
            var sum_fields = 0;
            var previous_was_number = false;

            for (var k = 0; k < rows[i].length; k++) {
                if (!isNaN(rows[i][k])) {
                    if (previous_was_number) {
                        return {valid: false, error_number: 8, error: errors[8]};
                    }
                    sum_fields += parseInt(rows[i][k], 10);
                    previous_was_number = true;
                } else {
                    if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                        return {valid: false, error_number: 9, error: errors[9]};
                    }
                    sum_fields += 1;
                    previous_was_number = false;
                }
            }
            if (sum_fields !== 8) {
                return {valid: false, error_number: 10, error: errors[10]};
            }
        }

        if ((tokens[3][1] == "3" && tokens[1] == "w") ||
            (tokens[3][1] == "6" && tokens[1] == "b")) {
            return {valid: false, error_number: 11, error: errors[11]};
        }

        /* everything is okay! */
        return {valid: true, error_number: 0, error: errors[0]};
    }

    function generate_fen() {
        var empty = 0;
        var fen = "";

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (board[i] == null) {
                empty++;
            } else {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                var color = board[i].color;
                var piece = board[i].type;

                fen += (color === WHITE) ?
                    piece.toUpperCase() : piece.toLowerCase();
            }

            if ((i + 1) & 0x88) {
                if (empty > 0) {
                    fen += empty;
                }

                if (i !== SQUARES.h1) {
                    fen += "/";
                }

                empty = 0;
                i += 8;
            }
        }

        var cflags = "";
        if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += "K"; }
        if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += "Q"; }
        if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += "k"; }
        if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += "q"; }

        /* do we have an empty castling flag? */
        cflags = cflags || "-";
        var epflags = (ep_square === EMPTY) ? "-" : algebraic(ep_square);

        return [fen, turn, cflags, epflags, half_moves, move_number].join(" ");
    }

    function set_header(args) {
        for (var i = 0; i < args.length; i += 2) {
            if (typeof args[i] === "string" &&
                typeof args[i + 1] === "string") {
                header[args[i]] = args[i + 1];
            }
        }
        return header;
    }

    /* called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object.  if the FEN is
     * equal to the default position, the SetUp and FEN are deleted
     * the setup is only updated if history.length is zero, ie moves haven't been
     * made.
     */
    function update_setup(fen) {
        if (history.length > 0) return;

        if (fen !== DEFAULT_POSITION) {
            header["SetUp"] = "1";
            header["FEN"] = fen;
        } else {
            delete header["SetUp"];
            delete header["FEN"];
        }
    }

    function get(square) {
        var piece = board[SQUARES[square]];
        return (piece) ? {type: piece.type, color: piece.color} : null;
    }

    function put(piece, square) {
        /* check for valid piece object */
        if (!("type" in piece && "color" in piece)) {
            return false;
        }

        /* check for piece */
        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
            return false;
        }

        /* check for valid square */
        if (!(square in SQUARES)) {
            return false;
        }

        var sq = SQUARES[square];

        /* don't let the user place more than one king */
        if (piece.type == KING &&
            !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
            return false;
        }

        board[sq] = {type: piece.type, color: piece.color};
        if (piece.type === KING) {
            kings[piece.color] = sq;
        }

        update_setup(generate_fen());

        return true;
    }

    function remove(square) {
        var piece = get(square);
        board[SQUARES[square]] = null;
        if (piece && piece.type === KING) {
            kings[piece.color] = EMPTY;
        }

        update_setup(generate_fen());

        return piece;
    }

    function build_move(board, from, to, flags, promotion) {
        var move = {
            color: turn,
            from: from,
            to: to,
            flags: flags,
            piece: board[from].type
        };

        if (promotion) {
            move.flags |= BITS.PROMOTION;
            move.promotion = promotion;
        }

        if (board[to]) {
            move.captured = board[to].type;
        } else if (flags & BITS.EP_CAPTURE) {
            move.captured = PAWN;
        }
        return move;
    }

    function generate_moves(options) {
        function add_move(board, moves, from, to, flags) {
            /* if pawn promotion */
            if (board[from].type === PAWN &&
                (rank(to) === RANK_8 || rank(to) === RANK_1)) {
                var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
                for (var i = 0, len = pieces.length; i < len; i++) {
                    moves.push(build_move(board, from, to, flags, pieces[i]));
                }
            } else {
                moves.push(build_move(board, from, to, flags));
            }
        }

        var moves = [];
        var us = turn;
        var them = swap_color(us);
        var second_rank = {b: RANK_7, w: RANK_2};

        var first_sq = SQUARES.a8;
        var last_sq = SQUARES.h1;
        var single_square = false;

        /* do we want legal moves? */
        var legal = (typeof options !== "undefined" && "legal" in options) ?
            options.legal : true;

        /* are we generating moves for a single square? */
        if (typeof options !== "undefined" && "square" in options) {
            if (options.square in SQUARES) {
                first_sq = last_sq = SQUARES[options.square];
                single_square = true;
            } else {
                /* invalid square */
                return [];
            }
        }

        for (var i = first_sq; i <= last_sq; i++) {
            /* did we run off the end of the board */
            if (i & 0x88) { i += 7; continue; }

            var piece = board[i];
            if (piece == null || piece.color !== us) {
                continue;
            }

            if (piece.type === PAWN) {
                /* single square, non-capturing */
                var square = i + PAWN_OFFSETS[us][0];
                if (board[square] == null) {
                    add_move(board, moves, i, square, BITS.NORMAL);

                    /* double square */
                    var square = i + PAWN_OFFSETS[us][1];
                    if (second_rank[us] === rank(i) && board[square] == null) {
                        add_move(board, moves, i, square, BITS.BIG_PAWN);
                    }
                }

                /* pawn captures */
                for (j = 2; j < 4; j++) {
                    var square = i + PAWN_OFFSETS[us][j];
                    if (square & 0x88) continue;

                    if (board[square] != null &&
                        board[square].color === them) {
                        add_move(board, moves, i, square, BITS.CAPTURE);
                    } else if (square === ep_square) {
                        add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
                    }
                }
            } else {
                for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
                    var offset = PIECE_OFFSETS[piece.type][j];
                    var square = i;

                    while (true) {
                        square += offset;
                        if (square & 0x88) break;

                        if (board[square] == null) {
                            add_move(board, moves, i, square, BITS.NORMAL);
                        } else {
                            if (board[square].color === us) break;
                            add_move(board, moves, i, square, BITS.CAPTURE);
                            break;
                        }

                        /* break, if knight or king */
                        if (piece.type === "n" || piece.type === "k") break;
                    }
                }
            }
        }

        /* check for castling if: a) we"re generating all moves, or b) we"re doing
         * single square move generation on the king"s square
         */
        if ((!single_square) || last_sq === kings[us]) {
            /* king-side castling */
            if (castling[us] & BITS.KSIDE_CASTLE) {
                var castling_from = kings[us];
                var castling_to = castling_from + 2;

                if (board[castling_from + 1] == null &&
                    board[castling_to]       == null &&
                    !attacked(them, kings[us]) &&
                    !attacked(them, castling_from + 1) &&
                    !attacked(them, castling_to)) {
                    add_move(board, moves, kings[us] , castling_to,
                        BITS.KSIDE_CASTLE);
                }
            }

            /* queen-side castling */
            if (castling[us] & BITS.QSIDE_CASTLE) {
                var castling_from = kings[us];
                var castling_to = castling_from - 2;

                if (board[castling_from - 1] == null &&
                    board[castling_from - 2] == null &&
                    board[castling_from - 3] == null &&
                    !attacked(them, kings[us]) &&
                    !attacked(them, castling_from - 1) &&
                    !attacked(them, castling_to)) {
                    add_move(board, moves, kings[us], castling_to,
                        BITS.QSIDE_CASTLE);
                }
            }
        }

        /* return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal) {
            return moves;
        }

        /* filter out illegal moves */
        var legal_moves = [];
        for (var i = 0, len = moves.length; i < len; i++) {
            make_move(moves[i]);
            if (!king_attacked(us)) {
                legal_moves.push(moves[i]);
            }
            undo_move();
        }

        return legal_moves;
    }

    /* convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} sloppy Use the sloppy SAN generator to work around over
     * disambiguation bugs in Fritz and Chessbase.  See below:
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    function move_to_san(move, sloppy) {

        var output = "";

        if (move.flags & BITS.KSIDE_CASTLE) {
            output = "O-O";
        } else if (move.flags & BITS.QSIDE_CASTLE) {
            output = "O-O-O";
        } else {
            var disambiguator = get_disambiguator(move, sloppy);

            if (move.piece !== PAWN) {
                output += move.piece.toUpperCase() + disambiguator;
            }

            if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                if (move.piece === PAWN) {
                    output += algebraic(move.from)[0];
                }
                output += "x";
            }

            output += algebraic(move.to);

            if (move.flags & BITS.PROMOTION) {
                output += "=" + move.promotion.toUpperCase();
            }
        }

        make_move(move);
        if (in_check()) {
            if (in_checkmate()) {
                output += "#";
            } else {
                output += "+";
            }
        }
        undo_move();

        return output;
    }

    // parses all of the decorators out of a SAN string
    function stripped_san(move) {
        return move.replace(/=/,"").replace(/[+#]?[?!]*$/,"");
    }

    function attacked(color, square) {
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            /* did we run off the end of the board */
            if (i & 0x88) { i += 7; continue; }

            /* if empty square or wrong color */
            if (board[i] == null || board[i].color !== color) continue;

            var piece = board[i];
            var difference = i - square;
            var index = difference + 119;

            if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
                if (piece.type === PAWN) {
                    if (difference > 0) {
                        if (piece.color === WHITE) return true;
                    } else {
                        if (piece.color === BLACK) return true;
                    }
                    continue;
                }

                /* if the piece is a knight or a king */
                if (piece.type === "n" || piece.type === "k") return true;

                var offset = RAYS[index];
                var j = i + offset;

                var blocked = false;
                while (j !== square) {
                    if (board[j] != null) { blocked = true; break; }
                    j += offset;
                }

                if (!blocked) return true;
            }
        }

        return false;
    }

    function king_attacked(color) {
        return attacked(swap_color(color), kings[color]);
    }

    function in_check() {
        return king_attacked(turn);
    }

    function in_checkmate() {
        return in_check() && generate_moves().length === 0;
    }

    function in_stalemate() {
        return !in_check() && generate_moves().length === 0;
    }

    function insufficient_material() {
        var pieces = {};
        var bishops = [];
        var num_pieces = 0;
        var sq_color = 0;

        for (var i = SQUARES.a8; i<= SQUARES.h1; i++) {
            sq_color = (sq_color + 1) % 2;
            if (i & 0x88) { i += 7; continue; }

            var piece = board[i];
            if (piece) {
                pieces[piece.type] = (piece.type in pieces) ?
                pieces[piece.type] + 1 : 1;
                if (piece.type === BISHOP) {
                    bishops.push(sq_color);
                }
                num_pieces++;
            }
        }

        /* k vs. k */
        if (num_pieces === 2) { return true; }

        /* k vs. kn .... or .... k vs. kb */
        else if (num_pieces === 3 && (pieces[BISHOP] === 1 ||
            pieces[KNIGHT] === 1)) { return true; }

        /* kb vs. kb where any number of bishops are all on the same color */
        else if (num_pieces === pieces[BISHOP] + 2) {
            var sum = 0;
            var len = bishops.length;
            for (var i = 0; i < len; i++) {
                sum += bishops[i];
            }
            if (sum === 0 || sum === len) { return true; }
        }

        return false;
    }

    function in_threefold_repetition() {
        /* TODO: while this function is fine for casual use, a better
         * implementation would use a Zobrist key (instead of FEN). the
         * Zobrist key would be maintained in the make_move/undo_move functions,
         * avoiding the costly that we do below.
         */
        var moves = [];
        var positions = {};
        var repetition = false;

        while (true) {
            var move = undo_move();
            if (!move) break;
            moves.push(move);
        }

        while (true) {
            /* remove the last two fields in the FEN string, they"re not needed
             * when checking for draw by rep */
            var fen = generate_fen().split(" ").slice(0,4).join(" ");

            /* has the position occurred three or move times */
            positions[fen] = (fen in positions) ? positions[fen] + 1 : 1;
            if (positions[fen] >= 3) {
                repetition = true;
            }

            if (!moves.length) {
                break;
            }
            make_move(moves.pop());
        }

        return repetition;
    }

    function push(move) {
        history.push({
            move: move,
            kings: {b: kings.b, w: kings.w},
            turn: turn,
            castling: {b: castling.b, w: castling.w},
            ep_square: ep_square,
            half_moves: half_moves,
            move_number: move_number
        });
    }

    function make_move(move) {
        var us = turn;
        var them = swap_color(us);
        push(move);

        board[move.to] = board[move.from];
        board[move.from] = null;

        /* if ep capture, remove the captured pawn */
        if (move.flags & BITS.EP_CAPTURE) {
            if (turn === BLACK) {
                board[move.to - 16] = null;
            } else {
                board[move.to + 16] = null;
            }
        }

        /* if pawn promotion, replace with new piece */
        if (move.flags & BITS.PROMOTION) {
            board[move.to] = {type: move.promotion, color: us};
        }

        /* if we moved the king */
        if (board[move.to].type === KING) {
            kings[board[move.to].color] = move.to;

            /* if we castled, move the rook next to the king */
            if (move.flags & BITS.KSIDE_CASTLE) {
                var castling_to = move.to - 1;
                var castling_from = move.to + 1;
                board[castling_to] = board[castling_from];
                board[castling_from] = null;
            } else if (move.flags & BITS.QSIDE_CASTLE) {
                var castling_to = move.to + 1;
                var castling_from = move.to - 2;
                board[castling_to] = board[castling_from];
                board[castling_from] = null;
            }

            /* turn off castling */
            castling[us] = "";
        }

        /* turn off castling if we move a rook */
        if (castling[us]) {
            for (var i = 0, len = ROOKS[us].length; i < len; i++) {
                if (move.from === ROOKS[us][i].square &&
                    castling[us] & ROOKS[us][i].flag) {
                    castling[us] ^= ROOKS[us][i].flag;
                    break;
                }
            }
        }

        /* turn off castling if we capture a rook */
        if (castling[them]) {
            for (var i = 0, len = ROOKS[them].length; i < len; i++) {
                if (move.to === ROOKS[them][i].square &&
                    castling[them] & ROOKS[them][i].flag) {
                    castling[them] ^= ROOKS[them][i].flag;
                    break;
                }
            }
        }

        /* if big pawn move, update the en passant square */
        if (move.flags & BITS.BIG_PAWN) {
            if (turn === "b") {
                ep_square = move.to - 16;
            } else {
                ep_square = move.to + 16;
            }
        } else {
            ep_square = EMPTY;
        }

        /* reset the 50 move counter if a pawn is moved or a piece is captured */
        if (move.piece === PAWN) {
            half_moves = 0;
        } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            half_moves = 0;
        } else {
            half_moves++;
        }

        if (turn === BLACK) {
            move_number++;
        }
        turn = swap_color(turn);
    }

    function undo_move() {
        var old = history.pop();
        if (old == null) { return null; }

        var move = old.move;
        kings = old.kings;
        turn = old.turn;
        castling = old.castling;
        ep_square = old.ep_square;
        half_moves = old.half_moves;
        move_number = old.move_number;

        var us = turn;
        var them = swap_color(turn);

        board[move.from] = board[move.to];
        board[move.from].type = move.piece;  // to undo any promotions
        board[move.to] = null;

        if (move.flags & BITS.CAPTURE) {
            board[move.to] = {type: move.captured, color: them};
        } else if (move.flags & BITS.EP_CAPTURE) {
            var index;
            if (us === BLACK) {
                index = move.to - 16;
            } else {
                index = move.to + 16;
            }
            board[index] = {type: PAWN, color: them};
        }


        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
            var castling_to, castling_from;
            if (move.flags & BITS.KSIDE_CASTLE) {
                castling_to = move.to + 1;
                castling_from = move.to - 1;
            } else if (move.flags & BITS.QSIDE_CASTLE) {
                castling_to = move.to - 2;
                castling_from = move.to + 1;
            }

            board[castling_to] = board[castling_from];
            board[castling_from] = null;
        }

        return move;
    }

    /* this function is used to uniquely identify ambiguous moves */
    function get_disambiguator(move, sloppy) {
        var moves = generate_moves({legal: !sloppy});

        var from = move.from;
        var to = move.to;
        var piece = move.piece;

        var ambiguities = 0;
        var same_rank = 0;
        var same_file = 0;

        for (var i = 0, len = moves.length; i < len; i++) {
            var ambig_from = moves[i].from;
            var ambig_to = moves[i].to;
            var ambig_piece = moves[i].piece;

            /* if a move of the same piece type ends on the same to square, we will
             * need to add a disambiguator to the algebraic notation
             */
            if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
                ambiguities++;

                if (rank(from) === rank(ambig_from)) {
                    same_rank++;
                }

                if (file(from) === file(ambig_from)) {
                    same_file++;
                }
            }
        }

        if (ambiguities > 0) {
            /* if there exists a similar moving piece on the same rank and file as
             * the move in question, use the square as the disambiguator
             */
            if (same_rank > 0 && same_file > 0) {
                return algebraic(from);
            }
            /* if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            else if (same_file > 0) {
                return algebraic(from).charAt(1);
            }
            /* else use the file symbol */
            else {
                return algebraic(from).charAt(0);
            }
        }

        return "";
    }

    function ascii() {
        var s = "   +------------------------+\n";
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            /* display the rank */
            if (file(i) === 0) {
                s += " " + "87654321"[rank(i)] + " |";
            }

            /* empty piece */
            if (board[i] == null) {
                s += " . ";
            } else {
                var piece = board[i].type;
                var color = board[i].color;
                var symbol = (color === WHITE) ?
                    piece.toUpperCase() : piece.toLowerCase();
                s += " " + symbol + " ";
            }

            if ((i + 1) & 0x88) {
                s += "|\n";
                i += 8;
            }
        }
        s += "   +------------------------+\n";
        s += "     a  b  c  d  e  f  g  h\n";

        return s;
    }

    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    function move_from_san(move, sloppy) {
        // strip off any move decorations: e.g Nf3+?!
        var clean_move = stripped_san(move);

        // if we are using the sloppy parser run a regex to grab piece, to, and from
        // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
        if (sloppy) {
            var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
            if (matches) {
                var piece = matches[1];
                var from = matches[2];
                var to = matches[3];
                var promotion = matches[4];
            }
        }

        var moves = generate_moves();
        for (var i = 0, len = moves.length; i < len; i++) {
            // try the strict parser first, then the sloppy parser if requested
            // by the user
            if ((clean_move === stripped_san(move_to_san(moves[i]))) ||
                (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))) {
                return moves[i];
            } else {
                if (matches &&
                    (!piece || piece.toLowerCase() == moves[i].piece) &&
                    SQUARES[from] == moves[i].from &&
                    SQUARES[to] == moves[i].to &&
                    (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                    return moves[i];
                }
            }
        }

        return null;
    }


    /*****************************************************************************
     * UTILITY FUNCTIONS
     ****************************************************************************/
    function rank(i) {
        return i >> 4;
    }

    function file(i) {
        return i & 15;
    }

    function algebraic(i){
        var f = file(i), r = rank(i);
        return "abcdefgh".substring(f,f+1) + "87654321".substring(r,r+1);
    }

    function swap_color(c) {
        return c === WHITE ? BLACK : WHITE;
    }

    function is_digit(c) {
        return "0123456789".indexOf(c) !== -1;
    }

    /* pretty = external move object */
    function make_pretty(ugly_move) {
        var move = clone(ugly_move);
        move.san = move_to_san(move, false);
        move.to = algebraic(move.to);
        move.from = algebraic(move.from);

        var flags = "";

        for (var flag in BITS) {
            if (BITS[flag] & move.flags) {
                flags += FLAGS[flag];
            }
        }
        move.flags = flags;

        return move;
    }

    function clone(obj) {
        var dupe = (obj instanceof Array) ? [] : {};

        for (var property in obj) {
            if (typeof property === "object") {
                dupe[property] = clone(obj[property]);
            } else {
                dupe[property] = obj[property];
            }
        }

        return dupe;
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/g, "");
    }

    /*****************************************************************************
     * DEBUGGING UTILITIES
     ****************************************************************************/
    function perft(depth) {
        var moves = generate_moves({legal: false});
        var nodes = 0;
        var color = turn;

        for (var i = 0, len = moves.length; i < len; i++) {
            make_move(moves[i]);
            if (!king_attacked(color)) {
                if (depth - 1 > 0) {
                    var child_nodes = perft(depth - 1);
                    nodes += child_nodes;
                } else {
                    nodes++;
                }
            }
            undo_move();
        }

        return nodes;
    }

    return {
        /***************************************************************************
         * PUBLIC CONSTANTS (is there a better way to do this?)
         **************************************************************************/
        WHITE: WHITE,
        BLACK: BLACK,
        PAWN: PAWN,
        KNIGHT: KNIGHT,
        BISHOP: BISHOP,
        ROOK: ROOK,
        QUEEN: QUEEN,
        KING: KING,
        SQUARES: (function() {
            /* from the ECMA-262 spec (section 12.6.4):
             * "The mechanics of enumerating the properties ... is
             * implementation dependent"
             * so: for (var sq in SQUARES) { keys.push(sq); } might not be
             * ordered correctly
             */
            var keys = [];
            for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                if (i & 0x88) { i += 7; continue; }
                keys.push(algebraic(i));
            }
            return keys;
        })(),
        FLAGS: FLAGS,

        /***************************************************************************
         * PUBLIC API
         **************************************************************************/
        load: function(fen) {
            return load(fen);
        },

        reset: function() {
            return reset();
        },

        moves: function(options) {
            /* The internal representation of a chess move is in 0x88 format, and
             * not meant to be human-readable.  The code below converts the 0x88
             * square coordinates to algebraic coordinates.  It also prunes an
             * unnecessary move keys resulting from a verbose call.
             */

            var ugly_moves = generate_moves(options);
            var moves = [];

            for (var i = 0, len = ugly_moves.length; i < len; i++) {

                /* does the user want a full move object (most likely not), or just
                 * SAN
                 */
                if (typeof options !== "undefined" && "verbose" in options &&
                    options.verbose) {
                    moves.push(make_pretty(ugly_moves[i]));
                } else {
                    moves.push(move_to_san(ugly_moves[i], false));
                }
            }

            return moves;
        },

        ugly_moves: function(options) {
            var ugly_moves = generate_moves(options);
            return ugly_moves;
        },

        in_check: function() {
            return in_check();
        },

        in_checkmate: function() {
            return in_checkmate();
        },

        in_stalemate: function() {
            return in_stalemate();
        },

        in_draw: function() {
            return half_moves >= 100 ||
                in_stalemate() ||
                insufficient_material() ||
                in_threefold_repetition();
        },

        insufficient_material: function() {
            return insufficient_material();
        },

        in_threefold_repetition: function() {
            return in_threefold_repetition();
        },

        game_over: function() {
            return half_moves >= 100 ||
                in_checkmate() ||
                in_stalemate() ||
                insufficient_material() ||
                in_threefold_repetition();
        },

        validate_fen: function(fen) {
            return validate_fen(fen);
        },

        fen: function() {
            return generate_fen();
        },

        board: function() {
            var output = [],
                row    = [];

            for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                if (board[i] == null) {
                    row.push(null)
                } else {
                    row.push({type: board[i].type, color: board[i].color})
                }
                if ((i + 1) & 0x88) {
                    output.push(row);
                    row = []
                    i += 8;
                }
            }

            return output;
        },

        pgn: function(options) {
            /* using the specification from http://www.chessclub.com/help/PGN-spec
             * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
             */
            var newline = (typeof options === "object" &&
            typeof options.newline_char === "string") ?
                options.newline_char : "\n";
            var max_width = (typeof options === "object" &&
            typeof options.max_width === "number") ?
                options.max_width : 0;
            var result = [];
            var header_exists = false;

            /* add the PGN header headerrmation */
            for (var i in header) {
                /* TODO: order of enumerated properties in header object is not
                 * guaranteed, see ECMA-262 spec (section 12.6.4)
                 */
                result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
                header_exists = true;
            }

            if (header_exists && history.length) {
                result.push(newline);
            }

            /* pop all of history onto reversed_history */
            var reversed_history = [];
            while (history.length > 0) {
                reversed_history.push(undo_move());
            }

            var moves = [];
            var move_string = "";

            /* build the list of moves.  a move_string looks like: "3. e3 e6" */
            while (reversed_history.length > 0) {
                var move = reversed_history.pop();

                /* if the position started with black to move, start PGN with 1. ... */
                if (!history.length && move.color === "b") {
                    move_string = move_number + ". ...";
                } else if (move.color === "w") {
                    /* store the previous generated move_string if we have one */
                    if (move_string.length) {
                        moves.push(move_string);
                    }
                    move_string = move_number + ".";
                }

                move_string = move_string + " " + move_to_san(move, false);
                make_move(move);
            }

            /* are there any other leftover moves? */
            if (move_string.length) {
                moves.push(move_string);
            }

            /* is there a result? */
            if (typeof header.Result !== "undefined") {
                moves.push(header.Result);
            }

            /* history should be back to what is was before we started generating PGN,
             * so join together moves
             */
            if (max_width === 0) {
                return result.join("") + moves.join(" ");
            }

            /* wrap the PGN output at max_width */
            var current_width = 0;
            for (var i = 0; i < moves.length; i++) {
                /* if the current move will push past max_width */
                if (current_width + moves[i].length > max_width && i !== 0) {

                    /* don't end the line with whitespace */
                    if (result[result.length - 1] === " ") {
                        result.pop();
                    }

                    result.push(newline);
                    current_width = 0;
                } else if (i !== 0) {
                    result.push(" ");
                    current_width++;
                }
                result.push(moves[i]);
                current_width += moves[i].length;
            }

            return result.join("");
        },

        load_pgn: function(pgn, options) {
            // allow the user to specify the sloppy move parser to work around over
            // disambiguation bugs in Fritz and Chessbase
            var sloppy = (typeof options !== "undefined" && "sloppy" in options) ?
                options.sloppy : false;

            function mask(str) {
                return str.replace(/\\/g, "\\");
            }

            function has_keys(object) {
                for (var key in object) {
                    return true;
                }
                return false;
            }

            function parse_pgn_header(header, options) {
                var newline_char = (typeof options === "object" &&
                typeof options.newline_char === "string") ?
                    options.newline_char : "\r?\n";
                var header_obj = {};
                var headers = header.split(new RegExp(mask(newline_char)));
                var key = "";
                var value = "";

                for (var i = 0; i < headers.length; i++) {
                    key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, "$1");
                    value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, "$1");
                    if (trim(key).length > 0) {
                        header_obj[key] = value;
                    }
                }

                return header_obj;
            }

            var newline_char = (typeof options === "object" &&
            typeof options.newline_char === "string") ?
                options.newline_char : "\r?\n";
            var regex = new RegExp("^(\\[(.|" + mask(newline_char) + ")*\\])" +
                "(" + mask(newline_char) + ")*" +
                "1.(" + mask(newline_char) + "|.)*$", "g");

            /* get header part of the PGN file */
            var header_string = pgn.replace(regex, "$1");

            /* no info part given, begins with moves */
            if (header_string[0] !== "[") {
                header_string = "";
            }

            reset();

            /* parse PGN header */
            var headers = parse_pgn_header(header_string, options);
            for (var key in headers) {
                set_header([key, headers[key]]);
            }

            /* load the starting position indicated by [Setup "1"] and
             * [FEN position] */
            if (headers["SetUp"] === "1") {
                if (!(("FEN" in headers) && load(headers["FEN"]))) {
                    return false;
                }
            }

            /* delete header to get the moves */
            var ms = pgn.replace(header_string, "").replace(new RegExp(mask(newline_char), "g"), " ");

            /* delete comments */
            ms = ms.replace(/(\{[^}]+\})+?/g, "");

            /* delete recursive annotation variations */
            var rav_regex = /(\([^\(\)]+\))+?/g
            while (rav_regex.test(ms)) {
                ms = ms.replace(rav_regex, "");
            }

            /* delete move numbers */
            ms = ms.replace(/\d+\.(\.\.)?/g, "");

            /* delete ... indicating black to move */
            ms = ms.replace(/\.\.\./g, "");

            /* delete numeric annotation glyphs */
            ms = ms.replace(/\$\d+/g, "");

            /* trim and get array of moves */
            var moves = trim(ms).split(new RegExp(/\s+/));

            /* delete empty entries */
            moves = moves.join(",").replace(/,,+/g, ",").split(",");
            var move = "";

            for (var half_move = 0; half_move < moves.length - 1; half_move++) {
                move = move_from_san(moves[half_move], sloppy);

                /* move not possible! (don't clear the board to examine to show the
                 * latest valid position)
                 */
                if (move == null) {
                    return false;
                } else {
                    make_move(move);
                }
            }

            /* examine last move */
            move = moves[moves.length - 1];
            if (POSSIBLE_RESULTS.indexOf(move) > -1) {
                if (has_keys(header) && typeof header.Result === "undefined") {
                    set_header(["Result", move]);
                }
            }
            else {
                move = move_from_san(move, sloppy);
                if (move == null) {
                    return false;
                } else {
                    make_move(move);
                }
            }
            return true;
        },

        header: function() {
            return set_header(arguments);
        },

        ascii: function() {
            return ascii();
        },

        turn: function() {
            return turn;
        },

        move: function(move, options) {
            /* The move function can be called with in the following parameters:
             *
             * .move("Nxb7")      <- where "move" is a case-sensitive SAN string
             *
             * .move({ from: "h7", <- where the "move" is a move object (additional
             *         to :"h8",      fields are ignored)
             *         promotion: "q",
             *      })
             */

            // allow the user to specify the sloppy move parser to work around over
            // disambiguation bugs in Fritz and Chessbase
            var sloppy = (typeof options !== "undefined" && "sloppy" in options) ?
                options.sloppy : false;

            var move_obj = null;

            if (typeof move === "string") {
                move_obj = move_from_san(move, sloppy);
            } else if (typeof move === "object") {
                var moves = generate_moves();

                /* convert the pretty move object to an ugly move object */
                for (var i = 0, len = moves.length; i < len; i++) {
                    if (move.from === algebraic(moves[i].from) &&
                        move.to === algebraic(moves[i].to) &&
                        (!("promotion" in moves[i]) ||
                        move.promotion === moves[i].promotion)) {
                        move_obj = moves[i];
                        break;
                    }
                }
            }

            /* failed to find move */
            if (!move_obj) {
                return null;
            }

            /* need to make a copy of move because we can't generate SAN after the
             * move is made
             */
            var pretty_move = make_pretty(move_obj);

            make_move(move_obj);

            return pretty_move;
        },

        ugly_move: function(move_obj, options) {
            var pretty_move = make_pretty(move_obj);
            make_move(move_obj);

            return pretty_move;
        },

        undo: function() {
            var move = undo_move();
            return (move) ? make_pretty(move) : null;
        },

        clear: function() {
            return clear();
        },

        put: function(piece, square) {
            return put(piece, square);
        },

        get: function(square) {
            return get(square);
        },

        remove: function(square) {
            return remove(square);
        },

        perft: function(depth) {
            return perft(depth);
        },

        square_color: function(square) {
            if (square in SQUARES) {
                var sq_0x88 = SQUARES[square];
                return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? "light" : "dark";
            }

            return null;
        },

        history: function(options) {
            var reversed_history = [];
            var move_history = [];
            var verbose = (typeof options !== "undefined" && "verbose" in options &&
            options.verbose);

            while (history.length > 0) {
                reversed_history.push(undo_move());
            }

            while (reversed_history.length > 0) {
                var move = reversed_history.pop();
                if (verbose) {
                    move_history.push(make_pretty(move));
                } else {
                    move_history.push(move_to_san(move));
                }
                make_move(move);
            }

            return move_history;
        }

    };
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== "undefined") exports.Chess = Chess;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== "undefined") define( function () { return Chess;  });

var onDragStart = function (source, piece, position, orientation)
    {
    if (thinking==false)
        {
        if (game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1 || thinking===true)
            {
            return false;
            }

        var moves = game.moves({square:source,verbose:true});

        //greySquare(source);

        for (var i = 0; i < moves.length; i++)
            {
            greySquare(moves[i].to);
            }
        }
    };

var onDrop = function (source, target)
    {
    thinking=true;

    var move = game.move({from:source,to:target,promotion:"q"});
    removeGreySquares();if (move === null){return "snapback"}

    document.getElementsByClassName("gui_gamestatus_label")[0].innerHTML = STRING_THINKING;
    document.getElementsByClassName("gui_gamestatus")[0].style.display = "block";

    setTimeout(function()
        {
        makeBestMove()
        },250);
    };

var onSnapEnd = function ()
    {
    board.position(game.fen());
    };

var onMouseoverSquare = function (square, piece)
    {
    var moves = game.moves({square:square,verbose:true});

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++)
        {
        greySquare(moves[i].to);
        }
    };

var onMouseoutSquare = function (square, piece)
    {
    removeGreySquares();
    };

var removeGreySquares = function ()
    {
    $("#board .square-55d63").css("background", "");
    };

var greySquare = function (square)
    {
    var squareEl = $("#board .square-" + square);
    var background = "url('data:image/png;base64,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')";
    if (squareEl.hasClass("black-3c85d") === true)
        {
        background = "url('data:image/png;base64,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')";
        }
    squareEl.css("background", background);
    squareEl.css("background-size", "100%");
    };

function checkGameStatus()
    {
    if (thinking==false)
        {
        if (game.game_over())
            {
            if (game.turn()=="b")
                {
                showLabel(STRING_HUMANWINS);
                }
                else
                {
                showLabel(STRING_AIWINS);
                }
            }
        else if (game.in_check())
            {
            showLabel(STRING_CHECK);
            }
        else
            {
            showLabel("HIDE");
            }
        }
    }

var makeBestMove = function ()
    {
    positionCount = 0;
    var gameDifficulty;

    var randomValue = Math.floor(Math.random() * 10);
    if (randomValue>=5)
        {
        gameDifficulty = 3;
        }
        else
        {
        gameDifficulty = 2;
        }

    minimaxRoot(gameDifficulty, game, true);
    };

// ------------------------------------------------------------------------
// CHESS AI ENGINE
// ------------------------------------------------------------------------

var positionCount;
var newGameMoves;
var newGameMove;
var bestMove;
var bestMoveFound;
var bestMoveCounter;

function minimaxRoot(depth, game, isMaximisingPlayer)
    {
    newGameMoves = game.ugly_moves();
    newGameMove = -1;
    bestMove = -9999;
    bestMoveFound = null;
    bestMoveCounter = -1;

    function loop()
        {
        if (bestMoveCounter<newGameMoves.length - 1)
            {
            bestMoveCounter = bestMoveCounter + 1;

            newGameMove = newGameMoves[bestMoveCounter];

            game.ugly_move(newGameMove);

            var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
            game.undo();

            if(value >= bestMove)
                {
                bestMove = value;
                bestMoveFound = newGameMove;
                }

            setTimeout(loop, 20);
            }
            else
            {
            game.ugly_move(bestMoveFound);
            board.position(game.fen());

            setTimeout(function(){thinking=false;checkGameStatus();},250);
            }
        }

    loop();
    }

function minimax(depth, game, alpha, beta, isMaximisingPlayer)
    {
    positionCount++;

    if (depth === 0)
        {
        return -evaluateBoard(game.board());
        }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer)
        {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++)
            {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha)
                {
                return bestMove;
                }
            }
        return bestMove;
        }
    else
        {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++)
            {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha)
                {
                return bestMove;
                }
            }
        return bestMove;
        }
    };

function evaluateBoard(board)
    {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++)
        {
        for (var j = 0; j < 8; j++)
            {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
            }
        }
    return totalEvaluation;
    }

function getPieceValue(piece, x, y)
    {
    if (piece === null)
        {
        return 0;
        }

    function getAbsoluteValue(piece, isWhite, x ,y)
        {
        if (piece.type === "p")
            {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
            }
        else if (piece.type === "r")
            {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
            }
        else if (piece.type === "n")
            {
            return 30 + knightEval[y][x];
            }
        else if (piece.type === "b")
            {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
            }
        else if (piece.type === "q")
            {
            return 90 + evalQueen[y][x];
            }
        else if (piece.type === "k")
            {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
            }
        throw "Unknown piece type: " + piece.type;
        }

    var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x ,y);

    return piece.color === "w" ? absoluteValue : -absoluteValue;
    };

function reverseArray(array)
    {
    return array.slice().reverse();
    }

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen =
    [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

// ------------------------------------------------------------------------
// BOARD CONFIGURATION
// ------------------------------------------------------------------------

var boardCfg = {draggable:true,
                position:"start",
                onDragStart:onDragStart,
                onDrop:onDrop,
                onSnapEnd:onSnapEnd,
                showNotation:false};