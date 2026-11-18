// Maths topics: every maths skill, whatever its grade, listed under the topics it practises (a skill may be in
// more than one). The "Topics" view of a subject page uses this; the grade view uses each skill's strand.
// A skill matches a topic when its strand or title matches the topic's pattern.
export const TOPICS = [
  { id: 'counting', name: 'Counting', icon: 'abc', re: /\bcount|skip.?count|how many|number before|number after|comes next|numbers? (to|up to) \d|one more|one less|make numbers|number words|ordinal|beyond 20/ },
  { id: 'place-value', name: 'Place value', icon: 'blocks', re: /place value|tens and ones|hundreds|expanded form|standard form|value of (the|a) digit|word names|number names|roman numeral/ },
  { id: 'comparing', name: 'Comparing and ordering', icon: 'scale', re: /compar|order|greater|less than|more or fewer|largest|smallest|inequalit/ },
  { id: 'addition', name: 'Addition', icon: 'plus', re: /\badd|addition|\bsum|make (ten|10)|doubles/ },
  { id: 'subtraction', name: 'Subtraction', icon: 'minus', re: /subtract|take away|difference/ },
  { id: 'multiplication', name: 'Multiplication', icon: 'times', re: /multipl|\btimes\b|product|equal groups|arrays?\b/ },
  { id: 'division', name: 'Division', icon: 'divide', re: /divi|quotient|remainder|share equally/ },
  { id: 'fluency', name: 'Fact fluency', icon: 'bolt', re: /facts?\b|fluency/ },
  { id: 'mixed', name: 'Mixed operations', icon: 'mix', re: /mixed operation|order of operations|all four|operations/ },
  { id: 'estimation', name: 'Estimation and rounding', icon: 'approx', re: /estimat|round/ },
  { id: 'number-theory', name: 'Number theory', icon: 'hash', re: /factor|multiple|prime|composite|divisib|gcf|lcm|even|odd|square number|perfect square/ },
  { id: 'fractions', name: 'Fractions', icon: 'pie', re: /fraction|numerator|denominator|mixed number|halves|thirds|fourths|quarters/ },
  { id: 'decimals', name: 'Decimals', icon: 'dot', re: /decimal|tenths|hundredths|thousandths/ },
  { id: 'percents', name: 'Percents', icon: 'percent', re: /percent|%|discount|tax|tip|interest|markup/ },
  { id: 'ratios', name: 'Ratios and proportions', icon: 'ratio', re: /ratio|rate|proportion|scale (drawing|factor)|unit price/ },
  { id: 'integers', name: 'Integers', icon: 'pm', re: /integer|negative|absolute value|opposite/ },
  { id: 'exponents', name: 'Exponents and roots', icon: 'power', re: /exponent|power|square root|cube root|radical|scientific notation|√/ },
  { id: 'patterns', name: 'Patterns', icon: 'pattern', re: /pattern|sequence|rule|input.?output/ },
  { id: 'algebra', name: 'Algebra', icon: 'x', re: /algebra|variable|expression|equation|solve|term|polynomial|factor(ing|ise|ize) quadratic|quadratic|binomial|like terms|distribut|variation|monomial/ },
  { id: 'functions', name: 'Functions and graphs of lines', icon: 'graph', re: /function|slope|linear|y = mx|intercept|system|relation|domain|range|parabola|vertex|variation/ },
  { id: 'properties', name: 'Properties', icon: 'prop', re: /propert|commutative|associative|identity|distributive/ },
  { id: 'money', name: 'Money and consumer maths', icon: 'coin', re: /money|coin|dollar|cents?\b|price|change|budget|purchase|consumer|financ|loan|interest/ },
  { id: 'measurement', name: 'Measurement', icon: 'ruler', re: /measur|length|mass|weight|capacity|volume|metre|litre|gram|unit|convert|temperature|thermometer/ },
  { id: 'time', name: 'Time', icon: 'clock', re: /time|clock|calendar|elapsed|hour|minute|schedule/ },
  { id: 'geometry', name: 'Geometry', icon: 'shape', re: /geometr|shape|angle|triangle|quadrilateral|polygon|circle|area|perimeter|volume|surface|symmetr|transform|reflect|rotat|translat|congruen|similar|three.?dimensional|two.?dimensional|solid|lines?\b|parallel|perpendicular|coordinate|pythag|position|left, middle|above|below|spatial|where is it|faces|edges|vertices|\bnets?\b|construct|compass/ },
  { id: 'data', name: 'Data and graphs', icon: 'chart', re: /data|graph|table|chart|plot|pictograph|tally|survey|mean|median|mode|range|statistic/ },
  { id: 'probability', name: 'Probability and statistics', icon: 'dice', re: /probab|likely|chance|outcome|combination|permutation|statistic|deviation|sample/ },
  { id: 'trigonometry', name: 'Trigonometry', icon: 'tri', re: /trig|sine|cosine|tangent|\bsin\b|\bcos\b|\btan\b|unit circle|radian/ },
  { id: 'calculus', name: 'Advanced: logs, limits and calculus', icon: 'calc', re: /logarithm|\blog\b|limit|derivative|calculus|complex|\bpowers of i\b|conic|vector|matri/ },
  { id: 'word-problems', name: 'Word problems', icon: 'book', re: /word problem|story problem|real.?world/ },
  { id: 'logic', name: 'Logic and reasoning', icon: 'bulb', re: /logic|reason|puzzle|venn|guess.?and.?check|same and different|sort|classif|\bsets?\b|subset|union|intersection|problem solving/ },
];
export const TOPIC = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

const cache = new Map();
export function topicsOf(skill) {
  if (cache.has(skill.id)) return cache.get(skill.id);
  const text = `${skill.strand} ${skill.title}`.toLowerCase();
  let ids = TOPICS.filter((t) => t.re.test(text)).map((t) => t.id);
  if (!ids.length) ids = ['mixed'];
  cache.set(skill.id, ids);
  return ids;
}
export const skillsInTopic = (skills, topic) => skills.filter((s) => topicsOf(s).includes(topic));
