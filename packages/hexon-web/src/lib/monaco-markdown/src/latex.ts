'use strict';

//copied from ../completion.ts
//TODO: refactor?

let accents1 = [
    'tilde', 'mathring',
    'widetilde', 'overgroup',
    'utilde', 'undergroup',
    'acute', 'vec', 'Overrightarrow',
    'bar', 'overleftarrow', 'overrightarrow',
    'breve', 'underleftarrow', 'underrightarrow',
    'check', 'overleftharpoon', 'overrightharpoon',
    'dot', 'overleftrightarrow', 'overbrace',
    'ddot', 'underleftrightarrow', 'underbrace',
    'grave', 'overline', 'overlinesegment',
    'hat', 'underline', 'underlinesegment',
    'widehat', 'widecheck'
];
let delimiters0 = [
    'lparen', 'rparen', 'lceil', 'rceil', 'uparrow',
    'lbrack', 'rbrack', 'lfloor', 'rfloor', 'downarrow', 'updownarrow',
    'langle', 'rangle', 'lgroup', 'rgroup', 'Uparrow',
    'vert', 'ulcorner', 'urcorner', 'Downarrow',
    'Vert', 'llcorner', 'lrcorner', 'Updownarrow',
    'lvert', 'rvert', 'lVert', 'rVert', 'backslash',
    'lang', 'rang', 'lt', 'gt'
];
let delimeterSizing0 = [
    'left', 'big', 'bigl', 'bigm', 'bigr',
    'middle', 'Big', 'Bigl', 'Bigm', 'Bigr',
    'right', 'bigg', 'biggl', 'biggm', 'biggr',
    'Bigg', 'Biggl', 'Biggm', 'Biggr'
];
let greekLetters0 = [
    'Alpha', 'Beta', 'Gamma', 'Delta',
    'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu',
    'Nu', 'Xi', 'Omicron', 'Pi',
    'Sigma', 'Tau', 'Upsilon', 'Phi',
    'Chi', 'Psi', 'Omega',
    'varGamma', 'varDelta', 'varTheta', 'varLambda',
    'varXi', 'varPi', 'varSigma', 'varUpsilon',
    'varPhi', 'varPsi', 'varOmega',
    'alpha', 'beta', 'gamma', 'delta',
    'epsilon', 'zeta', 'eta', 'theta',
    'iota', 'kappa', 'lambda', 'mu',
    'nu', 'xi', 'omicron', 'pi',
    'rho', 'sigma', 'tau', 'upsilon',
    'phi', 'chi', 'psi', 'omega',
    'varepsilon', 'varkappa', 'vartheta', 'thetasym',
    'varpi', 'varrho', 'varsigma', 'varphi',
    'digamma'
];
let otherLetters0 = [
    'imath', 'nabla', 'Im', 'Reals',
    'jmath', 'partial', 'image', 'wp',
    'aleph', 'Game', 'Bbbk', 'weierp',
    'alef', 'Finv', 'N', 'Z',
    'alefsym', 'cnums', 'natnums',
    'beth', 'Complex', 'R',
    'gimel', 'ell', 'Re',
    'daleth', 'hbar', 'real',
    'eth', 'hslash', 'reals'
];
let annotation1 = [
    'cancel', 'overbrace',
    'bcancel', 'underbrace',
    'xcancel', 'not =',
    'sout', 'boxed',
    'tag', 'tag*'
];
let verticalLayout0 = ['atop']
let verticalLayout2 = ['stackrel', 'overset', 'underset', 'raisebox'];
let overlap1 = ['mathllap', 'mathrlap', 'mathclap', 'llap', 'rlap', 'clap', 'smash'];
let spacing0 = [
    'thinspace', 'medspace', 'thickspace', 'enspace',
    'quad', 'qquad', 'negthinspace', 'negmedspace',
    'nobreakspace', 'negthickspace'
];
let spacing1 = [
    'kern', 'mkern', 'mskip', 'hskip',
    'hspace', 'hspace*', 'phantom', 'hphantom', 'vphantom'
];
let logicAndSetTheory0 = [
    'forall', 'complement', 'therefore', 'emptyset',
    'exists', 'subset', 'because', 'empty',
    'exist', 'supset', 'mapsto', 'varnothing',
    'nexists', 'mid', 'to', 'implies',
    'in', 'land', 'gets', 'impliedby',
    'isin', 'lor', 'leftrightarrow', 'iff',
    'notin', 'ni', 'notni', 'neg', 'lnot'
];
let bigOperators0 = [
    'sum', 'prod', 'bigotimes', 'bigvee',
    'int', 'coprod', 'bigoplus', 'bigwedge',
    'iint', 'intop', 'bigodot', 'bigcap',
    'iiint', 'smallint', 'biguplus', 'bigcup',
    'oint', 'oiint', 'oiiint', 'bigsqcup'
];
let binaryOperators0 = [
    'cdot', 'gtrdot', 'pmod',
    'cdotp', 'intercal', 'pod',
    'centerdot', 'land', 'rhd',
    'circ', 'leftthreetimes', 'rightthreetimes',
    'amalg', 'circledast', 'ldotp', 'rtimes',
    'And', 'circledcirc', 'lor', 'setminus',
    'ast', 'circleddash', 'lessdot', 'smallsetminus',
    'barwedge', 'Cup', 'lhd', 'sqcap',
    'bigcirc', 'cup', 'ltimes', 'sqcup',
    'bmod', 'curlyvee', 'times',
    'boxdot', 'curlywedge', 'mp', 'unlhd',
    'boxminus', 'div', 'odot', 'unrhd',
    'boxplus', 'divideontimes', 'ominus', 'uplus',
    'boxtimes', 'dotplus', 'oplus', 'vee',
    'bullet', 'doublebarwedge', 'otimes', 'veebar',
    'Cap', 'doublecap', 'oslash', 'wedge',
    'cap', 'doublecup', 'pm', 'plusmn', 'wr'
];
let fractions0 = ['over', 'above'];
let fractions2 = ['frac', 'dfrac', 'tfrac', 'cfrac', 'genfrac'];
let binomialCoefficients0 = ['choose'];
let binomialCoefficients2 = ['binom', 'dbinom', 'tbinom', 'brace', 'brack'];
let mathOperators0 = [
    'arcsin', 'cotg', 'ln', 'det',
    'arccos', 'coth', 'log', 'gcd',
    'arctan', 'csc', 'sec', 'inf',
    'arctg', 'ctg', 'sin', 'lim',
    'arcctg', 'cth', 'sinh', 'liminf',
    'arg', 'deg', 'sh', 'limsup',
    'ch', 'dim', 'tan', 'max',
    'cos', 'exp', 'tanh', 'min',
    'cosec', 'hom', 'tg', 'Pr',
    'cosh', 'ker', 'th', 'sup',
    'cot', 'lg', 'argmax',
    'argmin', 'limits'
];
let mathOperators1 = ['operatorname'];
let sqrt1 = ['sqrt'];
let relations0 = [
    'eqcirc', 'lesseqgtr', 'sqsupset',
    'eqcolon', 'lesseqqgtr', 'sqsupseteq',
    'Eqcolon', 'lessgtr', 'Subset',
    'eqqcolon', 'lesssim', 'subset',
    'approx', 'Eqqcolon', 'll', 'subseteq', 'sube',
    'approxeq', 'eqsim', 'lll', 'subseteqq',
    'asymp', 'eqslantgtr', 'llless', 'succ',
    'backepsilon', 'eqslantless', 'lt', 'succapprox',
    'backsim', 'equiv', 'mid', 'succcurlyeq',
    'backsimeq', 'fallingdotseq', 'models', 'succeq',
    'between', 'frown', 'multimap', 'succsim',
    'bowtie', 'ge', 'owns', 'Supset',
    'bumpeq', 'geq', 'parallel', 'supset',
    'Bumpeq', 'geqq', 'perp', 'supseteq',
    'circeq', 'geqslant', 'pitchfork', 'supseteqq',
    'colonapprox', 'gg', 'prec', 'thickapprox',
    'Colonapprox', 'ggg', 'precapprox', 'thicksim',
    'coloneq', 'gggtr', 'preccurlyeq', 'trianglelefteq',
    'Coloneq', 'gt', 'preceq', 'triangleq',
    'coloneqq', 'gtrapprox', 'precsim', 'trianglerighteq',
    'Coloneqq', 'gtreqless', 'propto', 'varpropto',
    'colonsim', 'gtreqqless', 'risingdotseq', 'vartriangle',
    'Colonsim', 'gtrless', 'shortmid', 'vartriangleleft',
    'cong', 'gtrsim', 'shortparallel', 'vartriangleright',
    'curlyeqprec', 'in', 'sim', 'vcentcolon',
    'curlyeqsucc', 'Join', 'simeq', 'vdash',
    'dashv', 'le', 'smallfrown', 'vDash',
    'dblcolon', 'leq', 'smallsmile', 'Vdash',
    'doteq', 'leqq', 'smile', 'Vvdash',
    'Doteq', 'leqslant', 'sqsubset',
    'doteqdot', 'lessapprox', 'sqsubseteq'
];
let negatedRelations0 = [
    'gnapprox', 'ngeqslant', 'nsubseteq', 'precneqq',
    'gneq', 'ngtr', 'nsubseteqq', 'precnsim',
    'gneqq', 'nleq', 'nsucc', 'subsetneq',
    'gnsim', 'nleqq', 'nsucceq', 'subsetneqq',
    'gvertneqq', 'nleqslant', 'nsupseteq', 'succnapprox',
    'lnapprox', 'nless', 'nsupseteqq', 'succneqq',
    'lneq', 'nmid', 'ntriangleleft', 'succnsim',
    'lneqq', 'notin', 'ntrianglelefteq', 'supsetneq',
    'lnsim', 'notni', 'ntriangleright', 'supsetneqq',
    'lvertneqq', 'nparallel', 'ntrianglerighteq', 'varsubsetneq',
    'ncong', 'nprec', 'nvdash', 'varsubsetneqq',
    'ne', 'npreceq', 'nvDash', 'varsupsetneq',
    'neq', 'nshortmid', 'nVDash', 'varsupsetneqq',
    'ngeq', 'nshortparallel', 'nVdash',
    'ngeqq', 'nsim', 'precnapprox'
];
let arrows0 = [
    'circlearrowleft', 'leftharpoonup', 'rArr',
    'circlearrowright', 'leftleftarrows', 'rarr',
    'curvearrowleft', 'leftrightarrow', 'restriction',
    'curvearrowright', 'Leftrightarrow', 'rightarrow',
    'Darr', 'leftrightarrows', 'Rightarrow',
    'dArr', 'leftrightharpoons', 'rightarrowtail',
    'darr', 'leftrightsquigarrow', 'rightharpoondown',
    'dashleftarrow', 'Lleftarrow', 'rightharpoonup',
    'dashrightarrow', 'longleftarrow', 'rightleftarrows',
    'downarrow', 'Longleftarrow', 'rightleftharpoons',
    'Downarrow', 'longleftrightarrow', 'rightrightarrows',
    'downdownarrows', 'Longleftrightarrow', 'rightsquigarrow',
    'downharpoonleft', 'longmapsto', 'Rrightarrow',
    'downharpoonright', 'longrightarrow', 'Rsh',
    'gets', 'Longrightarrow', 'searrow',
    'Harr', 'looparrowleft', 'swarrow',
    'hArr', 'looparrowright', 'to',
    'harr', 'Lrarr', 'twoheadleftarrow',
    'hookleftarrow', 'lrArr', 'twoheadrightarrow',
    'hookrightarrow', 'lrarr', 'Uarr',
    'iff', 'Lsh', 'uArr',
    'impliedby', 'mapsto', 'uarr',
    'implies', 'nearrow', 'uparrow',
    'Larr', 'nleftarrow', 'Uparrow',
    'lArr', 'nLeftarrow', 'updownarrow',
    'larr', 'nleftrightarrow', 'Updownarrow',
    'leadsto', 'nLeftrightarrow', 'upharpoonleft',
    'leftarrow', 'nrightarrow', 'upharpoonright',
    'Leftarrow', 'nRightarrow', 'upuparrows',
    'leftarrowtail', 'nwarrow', 'leftharpoondown', 'Rarr'
];
let extensibleArrows1 = [
    'xleftarrow', 'xrightarrow',
    'xLeftarrow', 'xRightarrow',
    'xleftrightarrow', 'xLeftrightarrow',
    'xhookleftarrow', 'xhookrightarrow',
    'xtwoheadleftarrow', 'xtwoheadrightarrow',
    'xleftharpoonup', 'xrightharpoonup',
    'xleftharpoondown', 'xrightharpoondown',
    'xleftrightharpoons', 'xrightleftharpoons',
    'xtofrom', 'xmapsto',
    'xlongequal'
];
let classAssignment1 = [
    'mathbin', 'mathclose', 'mathinner', 'mathop',
    'mathopen', 'mathord', 'mathpunct', 'mathrel'
];
let color2 = ['color', 'textcolor', 'colorbox'];
let font0 = ['rm', 'bf', 'it', 'sf', 'tt'];
let font1 = [
    'mathrm', 'mathbf', 'mathit',
    'mathnormal', 'textbf', 'textit',
    'textrm', 'bold', 'Bbb',
    'textnormal', 'boldsymbol', 'mathbb',
    'text', 'bm', 'frak',
    'mathsf', 'mathtt', 'mathfrak',
    'textsf', 'texttt', 'mathcal', 'mathscr'
];
let size0 = [
    'Huge', 'huge', 'LARGE', 'Large', 'large',
    'normalsize', 'small', 'footnotesize', 'scriptsize', 'tiny'
];
let style0 = [
    'displaystyle', 'textstyle', 'scriptstyle', 'scriptscriptstyle',
    'limits', 'nolimits', 'verb'
];
let symbolsAndPunctuation0 = [
    'cdots', 'LaTeX',
    'ddots', 'TeX',
    'ldots', 'nabla',
    'vdots', 'infty',
    'dotsb', 'infin',
    'dotsc', 'checkmark',
    'dotsi', 'dag',
    'dotsm', 'dagger',
    'dotso',
    'sdot', 'ddag',
    'mathellipsis', 'ddagger',
    'Box', 'Dagger',
    'lq', 'square', 'angle',
    'blacksquare', 'measuredangle',
    'rq', 'triangle', 'sphericalangle',
    'triangledown', 'top',
    'triangleleft', 'bot',
    'triangleright',
    'colon', 'bigtriangledown',
    'backprime', 'bigtriangleup', 'pounds',
    'prime', 'blacktriangle', 'mathsterling',
    'blacktriangledown',
    'blacktriangleleft', 'yen',
    'blacktriangleright', 'surd',
    'diamond', 'degree',
    'Diamond',
    'lozenge', 'mho',
    'blacklozenge', 'diagdown',
    'star', 'diagup',
    'bigstar', 'flat',
    'clubsuit', 'natural',
    'copyright', 'clubs', 'sharp',
    'circledR', 'diamondsuit', 'heartsuit',
    'diamonds', 'hearts',
    'circledS', 'spadesuit', 'spades',
    'maltese'
];

export let _c1 = Array.from(new Set(
    [
        ...delimiters0, ...delimeterSizing0,
        ...greekLetters0, ...otherLetters0,
        ...spacing0, ...verticalLayout0,
        ...logicAndSetTheory0, ...bigOperators0,
        ...binaryOperators0, ...binomialCoefficients0,
        ...fractions0, ...mathOperators0,
        ...relations0, ...negatedRelations0,
        ...arrows0, ...font0, ...size0,
        ...style0, ...symbolsAndPunctuation0
    ]
))

export let _c2 = Array.from(new Set(
    [
        ...accents1, ...annotation1,
        ...overlap1, ...spacing1,
        ...mathOperators1, ...sqrt1,
        ...extensibleArrows1, ...font1,
        ...classAssignment1
    ]
))

export let _c3 = Array.from(new Set(
    [
        ...verticalLayout2, ...binomialCoefficients2,
        ...fractions2, ...color2
    ]
))

export let _begin = ['begin', 'end']

export let begin_args = ['aligned', 'alignedat', 'array', 'bmatrix', 'Bmatrix', 'cases',
    'darray', 'dcases', 'gathered', 'matrix', 'pmatrix', 'vmatrix', 'Vmatrix']

export let all = [..._c1, ..._c2, ..._c3, ..._begin].map(i => '\\' + i)
