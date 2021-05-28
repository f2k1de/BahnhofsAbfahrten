/* eslint-disable */
module.exports = {
  name: '@yarnpkg/plugin-workspace-tools',
  factory: function (require) {
    var plugin;
    plugin = (() => {
      'use strict';
      var e = {
          660: (e, t, n) => {
            n.r(t), n.d(t, { default: () => g });
            const r = require('@yarnpkg/cli'),
              o = require('@yarnpkg/core'),
              s = require('clipanion');
            class a extends r.BaseCommand {
              constructor() {
                super(...arguments),
                  (this.json = s.Option.Boolean('--json', !1, {
                    description: 'Format the output as an NDJSON stream',
                  })),
                  (this.production = s.Option.Boolean('--production', !1, {
                    description:
                      'Only install regular dependencies by omitting dev dependencies',
                  })),
                  (this.all = s.Option.Boolean('-A,--all', !1, {
                    description: 'Install the entire project',
                  })),
                  (this.workspaces = s.Option.Rest());
              }
              async execute() {
                const e = await o.Configuration.find(
                    this.context.cwd,
                    this.context.plugins,
                  ),
                  { project: t, workspace: n } = await o.Project.find(
                    e,
                    this.context.cwd,
                  ),
                  s = await o.Cache.find(e);
                let a;
                if (
                  (await t.restoreInstallState({ restoreResolutions: !1 }),
                  this.all)
                )
                  a = new Set(t.workspaces);
                else if (0 === this.workspaces.length) {
                  if (!n)
                    throw new r.WorkspaceRequiredError(t.cwd, this.context.cwd);
                  a = new Set([n]);
                } else
                  a = new Set(
                    this.workspaces.map((e) =>
                      t.getWorkspaceByIdent(o.structUtils.parseIdent(e)),
                    ),
                  );
                for (const e of a)
                  for (const n of this.production
                    ? ['dependencies']
                    : o.Manifest.hardDependencies)
                    for (const r of e.manifest.getForScope(n).values()) {
                      const e = t.tryWorkspaceByDescriptor(r);
                      null !== e && a.add(e);
                    }
                for (const e of t.workspaces)
                  a.has(e)
                    ? this.production && e.manifest.devDependencies.clear()
                    : (e.manifest.dependencies.clear(),
                      e.manifest.devDependencies.clear(),
                      e.manifest.peerDependencies.clear(),
                      e.manifest.scripts.clear());
                return (
                  await o.StreamReport.start(
                    {
                      configuration: e,
                      json: this.json,
                      stdout: this.context.stdout,
                      includeLogs: !0,
                    },
                    async (e) => {
                      await t.install({
                        cache: s,
                        report: e,
                        persistProject: !1,
                      });
                    },
                  )
                ).exitCode();
              }
            }
            (a.paths = [['workspaces', 'focus']]),
              (a.usage = s.Command.Usage({
                category: 'Workspace-related commands',
                description: 'install a single workspace and its dependencies',
                details:
                  '\n      This command will run an install as if the specified workspaces (and all other workspaces they depend on) were the only ones in the project. If no workspaces are explicitly listed, the active one will be assumed.\n\n      Note that this command is only very moderately useful when using zero-installs, since the cache will contain all the packages anyway - meaning that the only difference between a full install and a focused install would just be a few extra lines in the `.pnp.cjs` file, at the cost of introducing an extra complexity.\n\n      If the `-A,--all` flag is set, the entire project will be installed. Combine with `--production` to replicate the old `yarn install --production`.\n    ',
              }));
            var i = n(529),
              l = n.n(i);
            const u = require('os');
            var p = n(741),
              c = n.n(p);
            const f = require('typanion');
            class d extends r.BaseCommand {
              constructor() {
                super(...arguments),
                  (this.recursive = s.Option.Boolean('-R,--recursive', !1, {
                    description:
                      'Find packages via dependencies/devDependencies instead of using the workspaces field',
                  })),
                  (this.all = s.Option.Boolean('-A,--all', !1, {
                    description:
                      'Run the command on all workspaces of a project',
                  })),
                  (this.verbose = s.Option.Boolean('-v,--verbose', !1, {
                    description:
                      'Prefix each output line with the name of the originating workspace',
                  })),
                  (this.parallel = s.Option.Boolean('-p,--parallel', !1, {
                    description: 'Run the commands in parallel',
                  })),
                  (this.interlaced = s.Option.Boolean('-i,--interlaced', !1, {
                    description:
                      'Print the output of commands in real-time instead of buffering it',
                  })),
                  (this.jobs = s.Option.String('-j,--jobs', {
                    description:
                      'The maximum number of parallel tasks that the execution will be limited to',
                    validator: f.applyCascade(f.isNumber(), [
                      f.isInteger(),
                      f.isAtLeast(2),
                    ]),
                  })),
                  (this.topological = s.Option.Boolean('-t,--topological', !1, {
                    description:
                      'Run the command after all workspaces it depends on (regular) have finished',
                  })),
                  (this.topologicalDev = s.Option.Boolean(
                    '--topological-dev',
                    !1,
                    {
                      description:
                        'Run the command after all workspaces it depends on (regular + dev) have finished',
                    },
                  )),
                  (this.include = s.Option.Array('--include', [], {
                    description:
                      'An array of glob pattern idents; only matching workspaces will be traversed',
                  })),
                  (this.exclude = s.Option.Array('--exclude', [], {
                    description:
                      "An array of glob pattern idents; matching workspaces won't be traversed",
                  })),
                  (this.publicOnly = s.Option.Boolean('--no-private', {
                    description:
                      'Avoid running the command on private workspaces',
                  })),
                  (this.commandName = s.Option.String()),
                  (this.args = s.Option.Proxy());
              }
              async execute() {
                const e = await o.Configuration.find(
                    this.context.cwd,
                    this.context.plugins,
                  ),
                  { project: t, workspace: n } = await o.Project.find(
                    e,
                    this.context.cwd,
                  );
                if (!this.all && !n)
                  throw new r.WorkspaceRequiredError(t.cwd, this.context.cwd);
                const a = this.cli.process([this.commandName, ...this.args]),
                  i =
                    1 === a.path.length &&
                    'run' === a.path[0] &&
                    void 0 !== a.scriptName
                      ? a.scriptName
                      : null;
                if (0 === a.path.length)
                  throw new s.UsageError(
                    "Invalid subcommand name for iteration - use the 'run' keyword if you wish to execute a script",
                  );
                const p = this.all ? t.topLevelWorkspace : n,
                  f = this.recursive
                    ? [p, ...p.getRecursiveWorkspaceDependencies()]
                    : [p, ...p.getRecursiveWorkspaceChildren()],
                  d = [];
                for (const e of f)
                  (!i || e.manifest.scripts.has(i) || i.includes(':')) &&
                    ((i === process.env.npm_lifecycle_event &&
                      e.cwd === n.cwd) ||
                      (this.include.length > 0 &&
                        !l().isMatch(
                          o.structUtils.stringifyIdent(e.locator),
                          this.include,
                        )) ||
                      (this.exclude.length > 0 &&
                        l().isMatch(
                          o.structUtils.stringifyIdent(e.locator),
                          this.exclude,
                        )) ||
                      (this.publicOnly && !0 === e.manifest.private) ||
                      d.push(e));
                let g = this.interlaced;
                this.parallel || (g = !0);
                const A = new Map(),
                  R = new Set(),
                  y = this.parallel ? Math.max(1, (0, u.cpus)().length / 2) : 1,
                  m = c()(this.jobs || y);
                let _ = 0,
                  E = null,
                  b = !1;
                const C = await o.StreamReport.start(
                  { configuration: e, stdout: this.context.stdout },
                  async (n) => {
                    const r = async (t, { commandIndex: r }) => {
                      if (b) return -1;
                      !this.parallel &&
                        this.verbose &&
                        r > 1 &&
                        n.reportSeparator();
                      const s = (function (
                          e,
                          { configuration: t, commandIndex: n, verbose: r },
                        ) {
                          if (!r) return null;
                          const s = o.structUtils.convertToIdent(e.locator),
                            a = `[${o.structUtils.stringifyIdent(s)}]:`,
                            i = [
                              '#2E86AB',
                              '#A23B72',
                              '#F18F01',
                              '#C73E1D',
                              '#CCE2A3',
                            ],
                            l = i[n % i.length];
                          return o.formatUtils.pretty(t, a, l);
                        })(t, {
                          configuration: e,
                          verbose: this.verbose,
                          commandIndex: r,
                        }),
                        [a, i] = h(n, { prefix: s, interlaced: g }),
                        [l, u] = h(n, { prefix: s, interlaced: g });
                      try {
                        this.verbose &&
                          n.reportInfo(null, s + ' Process started');
                        const r = Date.now(),
                          p =
                            (await this.cli.run(
                              [this.commandName, ...this.args],
                              { cwd: t.cwd, stdout: a, stderr: l },
                            )) || 0;
                        a.end(), l.end(), await i, await u;
                        const c = Date.now();
                        if (this.verbose) {
                          const t = e.get('enableTimers')
                            ? ', completed in ' +
                              o.formatUtils.pretty(
                                e,
                                c - r,
                                o.formatUtils.Type.DURATION,
                              )
                            : '';
                          n.reportInfo(
                            null,
                            `${s} Process exited (exit code ${p})${t}`,
                          );
                        }
                        return 130 === p && ((b = !0), (E = p)), p;
                      } catch (e) {
                        throw (a.end(), l.end(), await i, await u, e);
                      }
                    };
                    for (const e of d) A.set(e.anchoredLocator.locatorHash, e);
                    for (; A.size > 0 && !n.hasErrors(); ) {
                      const s = [];
                      for (const [e, n] of A) {
                        if (R.has(n.anchoredDescriptor.descriptorHash))
                          continue;
                        let o = !0;
                        if (this.topological || this.topologicalDev) {
                          const e = this.topologicalDev
                            ? new Map([
                                ...n.manifest.dependencies,
                                ...n.manifest.devDependencies,
                              ])
                            : n.manifest.dependencies;
                          for (const n of e.values()) {
                            const e = t.tryWorkspaceByDescriptor(n);
                            if (
                              ((o =
                                null === e ||
                                !A.has(e.anchoredLocator.locatorHash)),
                              !o)
                            )
                              break;
                          }
                        }
                        if (
                          o &&
                          (R.add(n.anchoredDescriptor.descriptorHash),
                          s.push(
                            m(async () => {
                              const t = await r(n, { commandIndex: ++_ });
                              return (
                                A.delete(e),
                                R.delete(n.anchoredDescriptor.descriptorHash),
                                t
                              );
                            }),
                          ),
                          !this.parallel)
                        )
                          break;
                      }
                      if (0 === s.length) {
                        const t = Array.from(A.values())
                          .map((t) =>
                            o.structUtils.prettyLocator(e, t.anchoredLocator),
                          )
                          .join(', ');
                        return void n.reportError(
                          o.MessageName.CYCLIC_DEPENDENCIES,
                          `Dependency cycle detected (${t})`,
                        );
                      }
                      const a = (await Promise.all(s)).find((e) => 0 !== e);
                      null === E && (E = void 0 !== a ? 1 : E),
                        (this.topological || this.topologicalDev) &&
                          void 0 !== a &&
                          n.reportError(
                            o.MessageName.UNNAMED,
                            "The command failed for workspaces that are depended upon by other workspaces; can't satisfy the dependency graph",
                          );
                    }
                  },
                );
                return null !== E ? E : C.exitCode();
              }
            }
            function h(e, { prefix: t, interlaced: n }) {
              const r = e.createStreamReporter(t),
                s = new o.miscUtils.DefaultStream();
              s.pipe(r, { end: !1 }),
                s.on('finish', () => {
                  r.end();
                });
              const a = new Promise((e) => {
                r.on('finish', () => {
                  e(s.active);
                });
              });
              if (n) return [s, a];
              const i = new o.miscUtils.BufferStream();
              return (
                i.pipe(s, { end: !1 }),
                i.on('finish', () => {
                  s.end();
                }),
                [i, a]
              );
            }
            (d.paths = [['workspaces', 'foreach']]),
              (d.usage = s.Command.Usage({
                category: 'Workspace-related commands',
                description: 'run a command on all workspaces',
                details:
                  "\n      This command will run a given sub-command on current and all its descendant workspaces. Various flags can alter the exact behavior of the command:\n\n      - If `-p,--parallel` is set, the commands will be ran in parallel; they'll by default be limited to a number of parallel tasks roughly equal to half your core number, but that can be overridden via `-j,--jobs`.\n\n      - If `-p,--parallel` and `-i,--interlaced` are both set, Yarn will print the lines from the output as it receives them. If `-i,--interlaced` wasn't set, it would instead buffer the output from each process and print the resulting buffers only after their source processes have exited.\n\n      - If `-t,--topological` is set, Yarn will only run the command after all workspaces that it depends on through the `dependencies` field have successfully finished executing. If `--topological-dev` is set, both the `dependencies` and `devDependencies` fields will be considered when figuring out the wait points.\n\n      - If `-A,--all` is set, Yarn will run the command on all the workspaces of a project. By default yarn runs the command only on current and all its descendant workspaces.\n\n      - If `-R,--recursive` is set, Yarn will find workspaces to run the command on by recursively evaluating `dependencies` and `devDependencies` fields, instead of looking at the `workspaces` fields.\n\n      - The command may apply to only some workspaces through the use of `--include` which acts as a whitelist. The `--exclude` flag will do the opposite and will be a list of packages that mustn't execute the script. Both flags accept glob patterns (if valid Idents and supported by [micromatch](https://github.com/micromatch/micromatch)). Make sure to escape the patterns, to prevent your own shell from trying to expand them.\n\n      Adding the `-v,--verbose` flag will cause Yarn to print more information; in particular the name of the workspace that generated the output will be printed at the front of each line.\n\n      If the command is `run` and the script being run does not exist the child workspace will be skipped without error.\n    ",
                examples: [
                  [
                    'Publish current and all descendant packages',
                    'yarn workspaces foreach npm publish --tolerate-republish',
                  ],
                  [
                    'Run build script on current and all descendant packages',
                    'yarn workspaces foreach run build',
                  ],
                  [
                    'Run build script on current and all descendant packages in parallel, building dependent packages first',
                    'yarn workspaces foreach -pt run build',
                  ],
                ],
              }));
            const g = { commands: [a, d] };
          },
          46: (e, t, n) => {
            const r = n(372),
              o = n(179),
              s = n(273),
              a = n(8),
              i = (e, t = {}) => {
                let n = [];
                if (Array.isArray(e))
                  for (let r of e) {
                    let e = i.create(r, t);
                    Array.isArray(e) ? n.push(...e) : n.push(e);
                  }
                else n = [].concat(i.create(e, t));
                return (
                  t &&
                    !0 === t.expand &&
                    !0 === t.nodupes &&
                    (n = [...new Set(n)]),
                  n
                );
              };
            (i.parse = (e, t = {}) => a(e, t)),
              (i.stringify = (e, t = {}) =>
                r('string' == typeof e ? i.parse(e, t) : e, t)),
              (i.compile = (e, t = {}) => (
                'string' == typeof e && (e = i.parse(e, t)), o(e, t)
              )),
              (i.expand = (e, t = {}) => {
                'string' == typeof e && (e = i.parse(e, t));
                let n = s(e, t);
                return (
                  !0 === t.noempty && (n = n.filter(Boolean)),
                  !0 === t.nodupes && (n = [...new Set(n)]),
                  n
                );
              }),
              (i.create = (e, t = {}) =>
                '' === e || e.length < 3
                  ? [e]
                  : !0 !== t.expand
                  ? i.compile(e, t)
                  : i.expand(e, t)),
              (e.exports = i);
          },
          179: (e, t, n) => {
            const r = n(792),
              o = n(641);
            e.exports = (e, t = {}) => {
              let n = (e, s = {}) => {
                let a = o.isInvalidBrace(s),
                  i = !0 === e.invalid && !0 === t.escapeInvalid,
                  l = !0 === a || !0 === i,
                  u = !0 === t.escapeInvalid ? '\\' : '',
                  p = '';
                if (!0 === e.isOpen) return u + e.value;
                if (!0 === e.isClose) return u + e.value;
                if ('open' === e.type) return l ? u + e.value : '(';
                if ('close' === e.type) return l ? u + e.value : ')';
                if ('comma' === e.type)
                  return 'comma' === e.prev.type ? '' : l ? e.value : '|';
                if (e.value) return e.value;
                if (e.nodes && e.ranges > 0) {
                  let n = o.reduce(e.nodes),
                    s = r(...n, { ...t, wrap: !1, toRegex: !0 });
                  if (0 !== s.length)
                    return n.length > 1 && s.length > 1 ? `(${s})` : s;
                }
                if (e.nodes) for (let t of e.nodes) p += n(t, e);
                return p;
              };
              return n(e);
            };
          },
          472: (e) => {
            e.exports = {
              MAX_LENGTH: 65536,
              CHAR_0: '0',
              CHAR_9: '9',
              CHAR_UPPERCASE_A: 'A',
              CHAR_LOWERCASE_A: 'a',
              CHAR_UPPERCASE_Z: 'Z',
              CHAR_LOWERCASE_Z: 'z',
              CHAR_LEFT_PARENTHESES: '(',
              CHAR_RIGHT_PARENTHESES: ')',
              CHAR_ASTERISK: '*',
              CHAR_AMPERSAND: '&',
              CHAR_AT: '@',
              CHAR_BACKSLASH: '\\',
              CHAR_BACKTICK: '`',
              CHAR_CARRIAGE_RETURN: '\r',
              CHAR_CIRCUMFLEX_ACCENT: '^',
              CHAR_COLON: ':',
              CHAR_COMMA: ',',
              CHAR_DOLLAR: '$',
              CHAR_DOT: '.',
              CHAR_DOUBLE_QUOTE: '"',
              CHAR_EQUAL: '=',
              CHAR_EXCLAMATION_MARK: '!',
              CHAR_FORM_FEED: '\f',
              CHAR_FORWARD_SLASH: '/',
              CHAR_HASH: '#',
              CHAR_HYPHEN_MINUS: '-',
              CHAR_LEFT_ANGLE_BRACKET: '<',
              CHAR_LEFT_CURLY_BRACE: '{',
              CHAR_LEFT_SQUARE_BRACKET: '[',
              CHAR_LINE_FEED: '\n',
              CHAR_NO_BREAK_SPACE: ' ',
              CHAR_PERCENT: '%',
              CHAR_PLUS: '+',
              CHAR_QUESTION_MARK: '?',
              CHAR_RIGHT_ANGLE_BRACKET: '>',
              CHAR_RIGHT_CURLY_BRACE: '}',
              CHAR_RIGHT_SQUARE_BRACKET: ']',
              CHAR_SEMICOLON: ';',
              CHAR_SINGLE_QUOTE: "'",
              CHAR_SPACE: ' ',
              CHAR_TAB: '\t',
              CHAR_UNDERSCORE: '_',
              CHAR_VERTICAL_LINE: '|',
              CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\ufeff',
            };
          },
          273: (e, t, n) => {
            const r = n(792),
              o = n(372),
              s = n(641),
              a = (e = '', t = '', n = !1) => {
                let r = [];
                if (((e = [].concat(e)), !(t = [].concat(t)).length)) return e;
                if (!e.length) return n ? s.flatten(t).map((e) => `{${e}}`) : t;
                for (let o of e)
                  if (Array.isArray(o)) for (let e of o) r.push(a(e, t, n));
                  else
                    for (let e of t)
                      !0 === n && 'string' == typeof e && (e = `{${e}}`),
                        r.push(Array.isArray(e) ? a(o, e, n) : o + e);
                return s.flatten(r);
              };
            e.exports = (e, t = {}) => {
              let n = void 0 === t.rangeLimit ? 1e3 : t.rangeLimit,
                i = (e, l = {}) => {
                  e.queue = [];
                  let u = l,
                    p = l.queue;
                  for (; 'brace' !== u.type && 'root' !== u.type && u.parent; )
                    (u = u.parent), (p = u.queue);
                  if (e.invalid || e.dollar)
                    return void p.push(a(p.pop(), o(e, t)));
                  if (
                    'brace' === e.type &&
                    !0 !== e.invalid &&
                    2 === e.nodes.length
                  )
                    return void p.push(a(p.pop(), ['{}']));
                  if (e.nodes && e.ranges > 0) {
                    let i = s.reduce(e.nodes);
                    if (s.exceedsLimit(...i, t.step, n))
                      throw new RangeError(
                        'expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.',
                      );
                    let l = r(...i, t);
                    return (
                      0 === l.length && (l = o(e, t)),
                      p.push(a(p.pop(), l)),
                      void (e.nodes = [])
                    );
                  }
                  let c = s.encloseBrace(e),
                    f = e.queue,
                    d = e;
                  for (; 'brace' !== d.type && 'root' !== d.type && d.parent; )
                    (d = d.parent), (f = d.queue);
                  for (let t = 0; t < e.nodes.length; t++) {
                    let n = e.nodes[t];
                    'comma' !== n.type || 'brace' !== e.type
                      ? 'close' !== n.type
                        ? n.value && 'open' !== n.type
                          ? f.push(a(f.pop(), n.value))
                          : n.nodes && i(n, e)
                        : p.push(a(p.pop(), f, c))
                      : (1 === t && f.push(''), f.push(''));
                  }
                  return f;
                };
              return s.flatten(i(e));
            };
          },
          8: (e, t, n) => {
            const r = n(372),
              {
                MAX_LENGTH: o,
                CHAR_BACKSLASH: s,
                CHAR_BACKTICK: a,
                CHAR_COMMA: i,
                CHAR_DOT: l,
                CHAR_LEFT_PARENTHESES: u,
                CHAR_RIGHT_PARENTHESES: p,
                CHAR_LEFT_CURLY_BRACE: c,
                CHAR_RIGHT_CURLY_BRACE: f,
                CHAR_LEFT_SQUARE_BRACKET: d,
                CHAR_RIGHT_SQUARE_BRACKET: h,
                CHAR_DOUBLE_QUOTE: g,
                CHAR_SINGLE_QUOTE: A,
                CHAR_NO_BREAK_SPACE: R,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE: y,
              } = n(472);
            e.exports = (e, t = {}) => {
              if ('string' != typeof e)
                throw new TypeError('Expected a string');
              let n = t || {},
                m =
                  'number' == typeof n.maxLength ? Math.min(o, n.maxLength) : o;
              if (e.length > m)
                throw new SyntaxError(
                  `Input length (${e.length}), exceeds max characters (${m})`,
                );
              let _,
                E = { type: 'root', input: e, nodes: [] },
                b = [E],
                C = E,
                x = E,
                v = 0,
                S = e.length,
                w = 0,
                H = 0;
              const T = () => e[w++],
                O = (e) => {
                  if (
                    ('text' === e.type && 'dot' === x.type && (x.type = 'text'),
                    !x || 'text' !== x.type || 'text' !== e.type)
                  )
                    return (
                      C.nodes.push(e), (e.parent = C), (e.prev = x), (x = e), e
                    );
                  x.value += e.value;
                };
              for (O({ type: 'bos' }); w < S; )
                if (((C = b[b.length - 1]), (_ = T()), _ !== y && _ !== R))
                  if (_ !== s)
                    if (_ !== h)
                      if (_ !== d)
                        if (_ !== u)
                          if (_ !== p)
                            if (_ !== g && _ !== A && _ !== a)
                              if (_ !== c)
                                if (_ !== f)
                                  if (_ === i && H > 0) {
                                    if (C.ranges > 0) {
                                      C.ranges = 0;
                                      let e = C.nodes.shift();
                                      C.nodes = [
                                        e,
                                        { type: 'text', value: r(C) },
                                      ];
                                    }
                                    O({ type: 'comma', value: _ }), C.commas++;
                                  } else if (
                                    _ === l &&
                                    H > 0 &&
                                    0 === C.commas
                                  ) {
                                    let e = C.nodes;
                                    if (0 === H || 0 === e.length) {
                                      O({ type: 'text', value: _ });
                                      continue;
                                    }
                                    if ('dot' === x.type) {
                                      if (
                                        ((C.range = []),
                                        (x.value += _),
                                        (x.type = 'range'),
                                        3 !== C.nodes.length &&
                                          5 !== C.nodes.length)
                                      ) {
                                        (C.invalid = !0),
                                          (C.ranges = 0),
                                          (x.type = 'text');
                                        continue;
                                      }
                                      C.ranges++, (C.args = []);
                                      continue;
                                    }
                                    if ('range' === x.type) {
                                      e.pop();
                                      let t = e[e.length - 1];
                                      (t.value += x.value + _),
                                        (x = t),
                                        C.ranges--;
                                      continue;
                                    }
                                    O({ type: 'dot', value: _ });
                                  } else O({ type: 'text', value: _ });
                                else {
                                  if ('brace' !== C.type) {
                                    O({ type: 'text', value: _ });
                                    continue;
                                  }
                                  let e = 'close';
                                  (C = b.pop()),
                                    (C.close = !0),
                                    O({ type: e, value: _ }),
                                    H--,
                                    (C = b[b.length - 1]);
                                }
                              else {
                                H++;
                                let e =
                                  (x.value && '$' === x.value.slice(-1)) ||
                                  !0 === C.dollar;
                                (C = O({
                                  type: 'brace',
                                  open: !0,
                                  close: !1,
                                  dollar: e,
                                  depth: H,
                                  commas: 0,
                                  ranges: 0,
                                  nodes: [],
                                })),
                                  b.push(C),
                                  O({ type: 'open', value: _ });
                              }
                            else {
                              let e,
                                n = _;
                              for (
                                !0 !== t.keepQuotes && (_ = '');
                                w < S && (e = T());

                              )
                                if (e !== s) {
                                  if (e === n) {
                                    !0 === t.keepQuotes && (_ += e);
                                    break;
                                  }
                                  _ += e;
                                } else _ += e + T();
                              O({ type: 'text', value: _ });
                            }
                          else {
                            if ('paren' !== C.type) {
                              O({ type: 'text', value: _ });
                              continue;
                            }
                            (C = b.pop()),
                              O({ type: 'text', value: _ }),
                              (C = b[b.length - 1]);
                          }
                        else
                          (C = O({ type: 'paren', nodes: [] })),
                            b.push(C),
                            O({ type: 'text', value: _ });
                      else {
                        v++;
                        let e;
                        for (; w < S && (e = T()); )
                          if (((_ += e), e !== d))
                            if (e !== s) {
                              if (e === h && (v--, 0 === v)) break;
                            } else _ += T();
                          else v++;
                        O({ type: 'text', value: _ });
                      }
                    else O({ type: 'text', value: '\\' + _ });
                  else
                    O({ type: 'text', value: (t.keepEscaping ? _ : '') + T() });
              do {
                if (((C = b.pop()), 'root' !== C.type)) {
                  C.nodes.forEach((e) => {
                    e.nodes ||
                      ('open' === e.type && (e.isOpen = !0),
                      'close' === e.type && (e.isClose = !0),
                      e.nodes || (e.type = 'text'),
                      (e.invalid = !0));
                  });
                  let e = b[b.length - 1],
                    t = e.nodes.indexOf(C);
                  e.nodes.splice(t, 1, ...C.nodes);
                }
              } while (b.length > 0);
              return O({ type: 'eos' }), E;
            };
          },
          372: (e, t, n) => {
            const r = n(641);
            e.exports = (e, t = {}) => {
              let n = (e, o = {}) => {
                let s = t.escapeInvalid && r.isInvalidBrace(o),
                  a = !0 === e.invalid && !0 === t.escapeInvalid,
                  i = '';
                if (e.value)
                  return (s || a) && r.isOpenOrClose(e)
                    ? '\\' + e.value
                    : e.value;
                if (e.value) return e.value;
                if (e.nodes) for (let t of e.nodes) i += n(t);
                return i;
              };
              return n(e);
            };
          },
          641: (e, t) => {
            (t.isInteger = (e) =>
              'number' == typeof e
                ? Number.isInteger(e)
                : 'string' == typeof e &&
                  '' !== e.trim() &&
                  Number.isInteger(Number(e))),
              (t.find = (e, t) => e.nodes.find((e) => e.type === t)),
              (t.exceedsLimit = (e, n, r = 1, o) =>
                !1 !== o &&
                !(!t.isInteger(e) || !t.isInteger(n)) &&
                (Number(n) - Number(e)) / Number(r) >= o),
              (t.escapeNode = (e, t = 0, n) => {
                let r = e.nodes[t];
                r &&
                  ((n && r.type === n) ||
                    'open' === r.type ||
                    'close' === r.type) &&
                  !0 !== r.escaped &&
                  ((r.value = '\\' + r.value), (r.escaped = !0));
              }),
              (t.encloseBrace = (e) =>
                'brace' === e.type &&
                (e.commas >> (0 + e.ranges)) >> 0 == 0 &&
                ((e.invalid = !0), !0)),
              (t.isInvalidBrace = (e) =>
                'brace' === e.type &&
                (!(!0 !== e.invalid && !e.dollar) ||
                  (((e.commas >> (0 + e.ranges)) >> 0 == 0 ||
                    !0 !== e.open ||
                    !0 !== e.close) &&
                    ((e.invalid = !0), !0)))),
              (t.isOpenOrClose = (e) =>
                'open' === e.type ||
                'close' === e.type ||
                !0 === e.open ||
                !0 === e.close),
              (t.reduce = (e) =>
                e.reduce(
                  (e, t) => (
                    'text' === t.type && e.push(t.value),
                    'range' === t.type && (t.type = 'text'),
                    e
                  ),
                  [],
                )),
              (t.flatten = (...e) => {
                const t = [],
                  n = (e) => {
                    for (let r = 0; r < e.length; r++) {
                      let o = e[r];
                      Array.isArray(o) ? n(o, t) : void 0 !== o && t.push(o);
                    }
                    return t;
                  };
                return n(e), t;
              });
          },
          792: (e, t, n) => {
            /*!
             * fill-range <https://github.com/jonschlinkert/fill-range>
             *
             * Copyright (c) 2014-present, Jon Schlinkert.
             * Licensed under the MIT License.
             */
            const r = n(669),
              o = n(543),
              s = (e) =>
                null !== e && 'object' == typeof e && !Array.isArray(e),
              a = (e) =>
                'number' == typeof e || ('string' == typeof e && '' !== e),
              i = (e) => Number.isInteger(+e),
              l = (e) => {
                let t = '' + e,
                  n = -1;
                if (('-' === t[0] && (t = t.slice(1)), '0' === t)) return !1;
                for (; '0' === t[++n]; );
                return n > 0;
              },
              u = (e, t, n) => {
                if (t > 0) {
                  let n = '-' === e[0] ? '-' : '';
                  n && (e = e.slice(1)),
                    (e = n + e.padStart(n ? t - 1 : t, '0'));
                }
                return !1 === n ? String(e) : e;
              },
              p = (e, t) => {
                let n = '-' === e[0] ? '-' : '';
                for (n && ((e = e.slice(1)), t--); e.length < t; ) e = '0' + e;
                return n ? '-' + e : e;
              },
              c = (e, t, n, r) => {
                if (n) return o(e, t, { wrap: !1, ...r });
                let s = String.fromCharCode(e);
                return e === t ? s : `[${s}-${String.fromCharCode(t)}]`;
              },
              f = (e, t, n) => {
                if (Array.isArray(e)) {
                  let t = !0 === n.wrap,
                    r = n.capture ? '' : '?:';
                  return t ? `(${r}${e.join('|')})` : e.join('|');
                }
                return o(e, t, n);
              },
              d = (...e) =>
                new RangeError('Invalid range arguments: ' + r.inspect(...e)),
              h = (e, t, n) => {
                if (!0 === n.strictRanges) throw d([e, t]);
                return [];
              },
              g = (e, t, n = 1, r = {}) => {
                let o = Number(e),
                  s = Number(t);
                if (!Number.isInteger(o) || !Number.isInteger(s)) {
                  if (!0 === r.strictRanges) throw d([e, t]);
                  return [];
                }
                0 === o && (o = 0), 0 === s && (s = 0);
                let a = o > s,
                  i = String(e),
                  h = String(t),
                  g = String(n);
                n = Math.max(Math.abs(n), 1);
                let A = l(i) || l(h) || l(g),
                  R = A ? Math.max(i.length, h.length, g.length) : 0,
                  y =
                    !1 === A &&
                    !1 ===
                      ((e, t, n) =>
                        'string' == typeof e ||
                        'string' == typeof t ||
                        !0 === n.stringify)(e, t, r),
                  m =
                    r.transform ||
                    (
                      (e) => (t) =>
                        !0 === e ? Number(t) : String(t)
                    )(y);
                if (r.toRegex && 1 === n) return c(p(e, R), p(t, R), !0, r);
                let _ = { negatives: [], positives: [] },
                  E = [],
                  b = 0;
                for (; a ? o >= s : o <= s; )
                  !0 === r.toRegex && n > 1
                    ? _[(C = o) < 0 ? 'negatives' : 'positives'].push(
                        Math.abs(C),
                      )
                    : E.push(u(m(o, b), R, y)),
                    (o = a ? o - n : o + n),
                    b++;
                var C;
                return !0 === r.toRegex
                  ? n > 1
                    ? ((e, t) => {
                        e.negatives.sort((e, t) =>
                          e < t ? -1 : e > t ? 1 : 0,
                        ),
                          e.positives.sort((e, t) =>
                            e < t ? -1 : e > t ? 1 : 0,
                          );
                        let n,
                          r = t.capture ? '' : '?:',
                          o = '',
                          s = '';
                        return (
                          e.positives.length && (o = e.positives.join('|')),
                          e.negatives.length &&
                            (s = `-(${r}${e.negatives.join('|')})`),
                          (n = o && s ? `${o}|${s}` : o || s),
                          t.wrap ? `(${r}${n})` : n
                        );
                      })(_, r)
                    : f(E, null, { wrap: !1, ...r })
                  : E;
              },
              A = (e, t, n, r = {}) => {
                if (null == t && a(e)) return [e];
                if (!a(e) || !a(t)) return h(e, t, r);
                if ('function' == typeof n) return A(e, t, 1, { transform: n });
                if (s(n)) return A(e, t, 0, n);
                let o = { ...r };
                return (
                  !0 === o.capture && (o.wrap = !0),
                  (n = n || o.step || 1),
                  i(n)
                    ? i(e) && i(t)
                      ? g(e, t, n, o)
                      : ((e, t, n = 1, r = {}) => {
                          if (
                            (!i(e) && e.length > 1) ||
                            (!i(t) && t.length > 1)
                          )
                            return h(e, t, r);
                          let o =
                              r.transform || ((e) => String.fromCharCode(e)),
                            s = ('' + e).charCodeAt(0),
                            a = ('' + t).charCodeAt(0),
                            l = s > a,
                            u = Math.min(s, a),
                            p = Math.max(s, a);
                          if (r.toRegex && 1 === n) return c(u, p, !1, r);
                          let d = [],
                            g = 0;
                          for (; l ? s >= a : s <= a; )
                            d.push(o(s, g)), (s = l ? s - n : s + n), g++;
                          return !0 === r.toRegex
                            ? f(d, null, { wrap: !1, options: r })
                            : d;
                        })(e, t, Math.max(Math.abs(n), 1), o)
                    : null == n || s(n)
                    ? A(e, t, 1, n)
                    : ((e, t) => {
                        if (!0 === t.strictRanges)
                          throw new TypeError(
                            `Expected step "${e}" to be a number`,
                          );
                        return [];
                      })(n, o)
                );
              };
            e.exports = A;
          },
          651: (e) => {
            /*!
             * is-number <https://github.com/jonschlinkert/is-number>
             *
             * Copyright (c) 2014-present, Jon Schlinkert.
             * Released under the MIT License.
             */
            e.exports = function (e) {
              return 'number' == typeof e
                ? e - e == 0
                : 'string' == typeof e &&
                    '' !== e.trim() &&
                    (Number.isFinite ? Number.isFinite(+e) : isFinite(+e));
            };
          },
          529: (e, t, n) => {
            const r = n(669),
              o = n(46),
              s = n(202),
              a = n(558),
              i = (e) => 'string' == typeof e && ('' === e || './' === e),
              l = (e, t, n) => {
                (t = [].concat(t)), (e = [].concat(e));
                let r = new Set(),
                  o = new Set(),
                  a = new Set(),
                  i = 0,
                  l = (e) => {
                    a.add(e.output), n && n.onResult && n.onResult(e);
                  };
                for (let a = 0; a < t.length; a++) {
                  let u = s(String(t[a]), { ...n, onResult: l }, !0),
                    p = u.state.negated || u.state.negatedExtglob;
                  p && i++;
                  for (let t of e) {
                    let e = u(t, !0);
                    (p ? !e.isMatch : e.isMatch) &&
                      (p
                        ? r.add(e.output)
                        : (r.delete(e.output), o.add(e.output)));
                  }
                }
                let u = (i === t.length ? [...a] : [...o]).filter(
                  (e) => !r.has(e),
                );
                if (n && 0 === u.length) {
                  if (!0 === n.failglob)
                    throw new Error(`No matches found for "${t.join(', ')}"`);
                  if (!0 === n.nonull || !0 === n.nullglob)
                    return n.unescape ? t.map((e) => e.replace(/\\/g, '')) : t;
                }
                return u;
              };
            (l.match = l),
              (l.matcher = (e, t) => s(e, t)),
              (l.any = l.isMatch = (e, t, n) => s(t, n)(e)),
              (l.not = (e, t, n = {}) => {
                t = [].concat(t).map(String);
                let r = new Set(),
                  o = [],
                  s = l(e, t, {
                    ...n,
                    onResult: (e) => {
                      n.onResult && n.onResult(e), o.push(e.output);
                    },
                  });
                for (let e of o) s.includes(e) || r.add(e);
                return [...r];
              }),
              (l.contains = (e, t, n) => {
                if ('string' != typeof e)
                  throw new TypeError(`Expected a string: "${r.inspect(e)}"`);
                if (Array.isArray(t)) return t.some((t) => l.contains(e, t, n));
                if ('string' == typeof t) {
                  if (i(e) || i(t)) return !1;
                  if (
                    e.includes(t) ||
                    (e.startsWith('./') && e.slice(2).includes(t))
                  )
                    return !0;
                }
                return l.isMatch(e, t, { ...n, contains: !0 });
              }),
              (l.matchKeys = (e, t, n) => {
                if (!a.isObject(e))
                  throw new TypeError(
                    'Expected the first argument to be an object',
                  );
                let r = l(Object.keys(e), t, n),
                  o = {};
                for (let t of r) o[t] = e[t];
                return o;
              }),
              (l.some = (e, t, n) => {
                let r = [].concat(e);
                for (let e of [].concat(t)) {
                  let t = s(String(e), n);
                  if (r.some((e) => t(e))) return !0;
                }
                return !1;
              }),
              (l.every = (e, t, n) => {
                let r = [].concat(e);
                for (let e of [].concat(t)) {
                  let t = s(String(e), n);
                  if (!r.every((e) => t(e))) return !1;
                }
                return !0;
              }),
              (l.all = (e, t, n) => {
                if ('string' != typeof e)
                  throw new TypeError(`Expected a string: "${r.inspect(e)}"`);
                return [].concat(t).every((t) => s(t, n)(e));
              }),
              (l.capture = (e, t, n) => {
                let r = a.isWindows(n),
                  o = s
                    .makeRe(String(e), { ...n, capture: !0 })
                    .exec(r ? a.toPosixSlashes(t) : t);
                if (o) return o.slice(1).map((e) => (void 0 === e ? '' : e));
              }),
              (l.makeRe = (...e) => s.makeRe(...e)),
              (l.scan = (...e) => s.scan(...e)),
              (l.parse = (e, t) => {
                let n = [];
                for (let r of [].concat(e || []))
                  for (let e of o(String(r), t)) n.push(s.parse(e, t));
                return n;
              }),
              (l.braces = (e, t) => {
                if ('string' != typeof e)
                  throw new TypeError('Expected a string');
                return (t && !0 === t.nobrace) || !/\{.*\}/.test(e)
                  ? [e]
                  : o(e, t);
              }),
              (l.braceExpand = (e, t) => {
                if ('string' != typeof e)
                  throw new TypeError('Expected a string');
                return l.braces(e, { ...t, expand: !0 });
              }),
              (e.exports = l);
          },
          741: (e, t, n) => {
            const r = n(765),
              o = (e) => {
                if (e < 1)
                  throw new TypeError(
                    'Expected `concurrency` to be a number from 1 and up',
                  );
                const t = [];
                let n = 0;
                const o = () => {
                    n--, t.length > 0 && t.shift()();
                  },
                  s = (e, t, ...s) => {
                    n++;
                    const a = r(e, ...s);
                    t(a), a.then(o, o);
                  },
                  a = (r, ...o) =>
                    new Promise((a) =>
                      ((r, o, ...a) => {
                        n < e
                          ? s(r, o, ...a)
                          : t.push(s.bind(null, r, o, ...a));
                      })(r, a, ...o),
                    );
                return (
                  Object.defineProperties(a, {
                    activeCount: { get: () => n },
                    pendingCount: { get: () => t.length },
                  }),
                  a
                );
              };
            (e.exports = o), (e.exports.default = o);
          },
          765: (e) => {
            e.exports = (e, ...t) =>
              new Promise((n) => {
                n(e(...t));
              });
          },
          202: (e, t, n) => {
            e.exports = n(73);
          },
          240: (e, t, n) => {
            const r = n(622),
              o = {
                DOT_LITERAL: '\\.',
                PLUS_LITERAL: '\\+',
                QMARK_LITERAL: '\\?',
                SLASH_LITERAL: '\\/',
                ONE_CHAR: '(?=.)',
                QMARK: '[^/]',
                END_ANCHOR: '(?:\\/|$)',
                DOTS_SLASH: '\\.{1,2}(?:\\/|$)',
                NO_DOT: '(?!\\.)',
                NO_DOTS: '(?!(?:^|\\/)\\.{1,2}(?:\\/|$))',
                NO_DOT_SLASH: '(?!\\.{0,1}(?:\\/|$))',
                NO_DOTS_SLASH: '(?!\\.{1,2}(?:\\/|$))',
                QMARK_NO_DOT: '[^.\\/]',
                STAR: '[^/]*?',
                START_ANCHOR: '(?:^|\\/)',
              },
              s = {
                ...o,
                SLASH_LITERAL: '[\\\\/]',
                QMARK: '[^\\\\/]',
                STAR: '[^\\\\/]*?',
                DOTS_SLASH: '\\.{1,2}(?:[\\\\/]|$)',
                NO_DOT: '(?!\\.)',
                NO_DOTS: '(?!(?:^|[\\\\/])\\.{1,2}(?:[\\\\/]|$))',
                NO_DOT_SLASH: '(?!\\.{0,1}(?:[\\\\/]|$))',
                NO_DOTS_SLASH: '(?!\\.{1,2}(?:[\\\\/]|$))',
                QMARK_NO_DOT: '[^.\\\\/]',
                START_ANCHOR: '(?:^|[\\\\/])',
                END_ANCHOR: '(?:[\\\\/]|$)',
              };
            e.exports = {
              MAX_LENGTH: 65536,
              POSIX_REGEX_SOURCE: {
                alnum: 'a-zA-Z0-9',
                alpha: 'a-zA-Z',
                ascii: '\\x00-\\x7F',
                blank: ' \\t',
                cntrl: '\\x00-\\x1F\\x7F',
                digit: '0-9',
                graph: '\\x21-\\x7E',
                lower: 'a-z',
                print: '\\x20-\\x7E ',
                punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
                space: ' \\t\\r\\n\\v\\f',
                upper: 'A-Z',
                word: 'A-Za-z0-9_',
                xdigit: 'A-Fa-f0-9',
              },
              REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
              REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
              REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
              REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
              REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
              REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
              REPLACEMENTS: { '***': '*', '**/**': '**', '**/**/**': '**' },
              CHAR_0: 48,
              CHAR_9: 57,
              CHAR_UPPERCASE_A: 65,
              CHAR_LOWERCASE_A: 97,
              CHAR_UPPERCASE_Z: 90,
              CHAR_LOWERCASE_Z: 122,
              CHAR_LEFT_PARENTHESES: 40,
              CHAR_RIGHT_PARENTHESES: 41,
              CHAR_ASTERISK: 42,
              CHAR_AMPERSAND: 38,
              CHAR_AT: 64,
              CHAR_BACKWARD_SLASH: 92,
              CHAR_CARRIAGE_RETURN: 13,
              CHAR_CIRCUMFLEX_ACCENT: 94,
              CHAR_COLON: 58,
              CHAR_COMMA: 44,
              CHAR_DOT: 46,
              CHAR_DOUBLE_QUOTE: 34,
              CHAR_EQUAL: 61,
              CHAR_EXCLAMATION_MARK: 33,
              CHAR_FORM_FEED: 12,
              CHAR_FORWARD_SLASH: 47,
              CHAR_GRAVE_ACCENT: 96,
              CHAR_HASH: 35,
              CHAR_HYPHEN_MINUS: 45,
              CHAR_LEFT_ANGLE_BRACKET: 60,
              CHAR_LEFT_CURLY_BRACE: 123,
              CHAR_LEFT_SQUARE_BRACKET: 91,
              CHAR_LINE_FEED: 10,
              CHAR_NO_BREAK_SPACE: 160,
              CHAR_PERCENT: 37,
              CHAR_PLUS: 43,
              CHAR_QUESTION_MARK: 63,
              CHAR_RIGHT_ANGLE_BRACKET: 62,
              CHAR_RIGHT_CURLY_BRACE: 125,
              CHAR_RIGHT_SQUARE_BRACKET: 93,
              CHAR_SEMICOLON: 59,
              CHAR_SINGLE_QUOTE: 39,
              CHAR_SPACE: 32,
              CHAR_TAB: 9,
              CHAR_UNDERSCORE: 95,
              CHAR_VERTICAL_LINE: 124,
              CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
              SEP: r.sep,
              extglobChars: (e) => ({
                '!': {
                  type: 'negate',
                  open: '(?:(?!(?:',
                  close: `))${e.STAR})`,
                },
                '?': { type: 'qmark', open: '(?:', close: ')?' },
                '+': { type: 'plus', open: '(?:', close: ')+' },
                '*': { type: 'star', open: '(?:', close: ')*' },
                '@': { type: 'at', open: '(?:', close: ')' },
              }),
              globChars: (e) => (!0 === e ? s : o),
            };
          },
          561: (e, t, n) => {
            const r = n(240),
              o = n(558),
              {
                MAX_LENGTH: s,
                POSIX_REGEX_SOURCE: a,
                REGEX_NON_SPECIAL_CHARS: i,
                REGEX_SPECIAL_CHARS_BACKREF: l,
                REPLACEMENTS: u,
              } = r,
              p = (e, t) => {
                if ('function' == typeof t.expandRange)
                  return t.expandRange(...e, t);
                e.sort();
                const n = `[${e.join('-')}]`;
                try {
                  new RegExp(n);
                } catch (t) {
                  return e.map((e) => o.escapeRegex(e)).join('..');
                }
                return n;
              },
              c = (e, t) =>
                `Missing ${e}: "${t}" - use "\\\\${t}" to match literal characters`,
              f = (e, t) => {
                if ('string' != typeof e)
                  throw new TypeError('Expected a string');
                e = u[e] || e;
                const n = { ...t },
                  f =
                    'number' == typeof n.maxLength
                      ? Math.min(s, n.maxLength)
                      : s;
                let d = e.length;
                if (d > f)
                  throw new SyntaxError(
                    `Input length: ${d}, exceeds maximum allowed length: ${f}`,
                  );
                const h = { type: 'bos', value: '', output: n.prepend || '' },
                  g = [h],
                  A = n.capture ? '' : '?:',
                  R = o.isWindows(t),
                  y = r.globChars(R),
                  m = r.extglobChars(y),
                  {
                    DOT_LITERAL: _,
                    PLUS_LITERAL: E,
                    SLASH_LITERAL: b,
                    ONE_CHAR: C,
                    DOTS_SLASH: x,
                    NO_DOT: v,
                    NO_DOT_SLASH: S,
                    NO_DOTS_SLASH: w,
                    QMARK: H,
                    QMARK_NO_DOT: T,
                    STAR: O,
                    START_ANCHOR: k,
                  } = y,
                  L = (e) => `(${A}(?:(?!${k}${e.dot ? x : _}).)*?)`,
                  $ = n.dot ? '' : v,
                  N = n.dot ? H : T;
                let I = !0 === n.bash ? L(n) : O;
                n.capture && (I = `(${I})`),
                  'boolean' == typeof n.noext && (n.noextglob = n.noext);
                const B = {
                  input: e,
                  index: -1,
                  start: 0,
                  dot: !0 === n.dot,
                  consumed: '',
                  output: '',
                  prefix: '',
                  backtrack: !1,
                  negated: !1,
                  brackets: 0,
                  braces: 0,
                  parens: 0,
                  quotes: 0,
                  globstar: !1,
                  tokens: g,
                };
                (e = o.removePrefix(e, B)), (d = e.length);
                const M = [],
                  D = [],
                  P = [];
                let U,
                  G = h;
                const K = () => B.index === d - 1,
                  j = (B.peek = (t = 1) => e[B.index + t]),
                  F = (B.advance = () => e[++B.index]),
                  W = () => e.slice(B.index + 1),
                  Q = (e = '', t = 0) => {
                    (B.consumed += e), (B.index += t);
                  },
                  X = (e) => {
                    (B.output += null != e.output ? e.output : e.value),
                      Q(e.value);
                  },
                  q = () => {
                    let e = 1;
                    for (; '!' === j() && ('(' !== j(2) || '?' === j(3)); )
                      F(), B.start++, e++;
                    return e % 2 != 0 && ((B.negated = !0), B.start++, !0);
                  },
                  Z = (e) => {
                    B[e]++, P.push(e);
                  },
                  Y = (e) => {
                    B[e]--, P.pop();
                  },
                  z = (e) => {
                    if ('globstar' === G.type) {
                      const t =
                          B.braces > 0 &&
                          ('comma' === e.type || 'brace' === e.type),
                        n =
                          !0 === e.extglob ||
                          (M.length &&
                            ('pipe' === e.type || 'paren' === e.type));
                      'slash' === e.type ||
                        'paren' === e.type ||
                        t ||
                        n ||
                        ((B.output = B.output.slice(0, -G.output.length)),
                        (G.type = 'star'),
                        (G.value = '*'),
                        (G.output = I),
                        (B.output += G.output));
                    }
                    if (
                      (M.length &&
                        'paren' !== e.type &&
                        !m[e.value] &&
                        (M[M.length - 1].inner += e.value),
                      (e.value || e.output) && X(e),
                      G && 'text' === G.type && 'text' === e.type)
                    )
                      return (
                        (G.value += e.value),
                        void (G.output = (G.output || '') + e.value)
                      );
                    (e.prev = G), g.push(e), (G = e);
                  },
                  V = (e, t) => {
                    const r = { ...m[t], conditions: 1, inner: '' };
                    (r.prev = G), (r.parens = B.parens), (r.output = B.output);
                    const o = (n.capture ? '(' : '') + r.open;
                    Z('parens'),
                      z({ type: e, value: t, output: B.output ? '' : C }),
                      z({ type: 'paren', extglob: !0, value: F(), output: o }),
                      M.push(r);
                  },
                  J = (e) => {
                    let t = e.close + (n.capture ? ')' : '');
                    if ('negate' === e.type) {
                      let r = I;
                      e.inner &&
                        e.inner.length > 1 &&
                        e.inner.includes('/') &&
                        (r = L(n)),
                        (r !== I || K() || /^\)+$/.test(W())) &&
                          (t = e.close = ')$))' + r),
                        'bos' === e.prev.type && K() && (B.negatedExtglob = !0);
                    }
                    z({ type: 'paren', extglob: !0, value: U, output: t }),
                      Y('parens');
                  };
                if (!1 !== n.fastpaths && !/(^[*!]|[/()[\]{}"])/.test(e)) {
                  let r = !1,
                    s = e.replace(l, (e, t, n, o, s, a) =>
                      '\\' === o
                        ? ((r = !0), e)
                        : '?' === o
                        ? t
                          ? t + o + (s ? H.repeat(s.length) : '')
                          : 0 === a
                          ? N + (s ? H.repeat(s.length) : '')
                          : H.repeat(n.length)
                        : '.' === o
                        ? _.repeat(n.length)
                        : '*' === o
                        ? t
                          ? t + o + (s ? I : '')
                          : I
                        : t
                        ? e
                        : '\\' + e,
                    );
                  return (
                    !0 === r &&
                      (s =
                        !0 === n.unescape
                          ? s.replace(/\\/g, '')
                          : s.replace(/\\+/g, (e) =>
                              e.length % 2 == 0 ? '\\\\' : e ? '\\' : '',
                            )),
                    s === e && !0 === n.contains
                      ? ((B.output = e), B)
                      : ((B.output = o.wrapOutput(s, B, t)), B)
                  );
                }
                for (; !K(); ) {
                  if (((U = F()), '\0' === U)) continue;
                  if ('\\' === U) {
                    const e = j();
                    if ('/' === e && !0 !== n.bash) continue;
                    if ('.' === e || ';' === e) continue;
                    if (!e) {
                      (U += '\\'), z({ type: 'text', value: U });
                      continue;
                    }
                    const t = /^\\+/.exec(W());
                    let r = 0;
                    if (
                      (t &&
                        t[0].length > 2 &&
                        ((r = t[0].length),
                        (B.index += r),
                        r % 2 != 0 && (U += '\\')),
                      !0 === n.unescape ? (U = F() || '') : (U += F() || ''),
                      0 === B.brackets)
                    ) {
                      z({ type: 'text', value: U });
                      continue;
                    }
                  }
                  if (
                    B.brackets > 0 &&
                    (']' !== U || '[' === G.value || '[^' === G.value)
                  ) {
                    if (!1 !== n.posix && ':' === U) {
                      const e = G.value.slice(1);
                      if (
                        e.includes('[') &&
                        ((G.posix = !0), e.includes(':'))
                      ) {
                        const e = G.value.lastIndexOf('['),
                          t = G.value.slice(0, e),
                          n = G.value.slice(e + 2),
                          r = a[n];
                        if (r) {
                          (G.value = t + r),
                            (B.backtrack = !0),
                            F(),
                            h.output || 1 !== g.indexOf(G) || (h.output = C);
                          continue;
                        }
                      }
                    }
                    (('[' === U && ':' !== j()) ||
                      ('-' === U && ']' === j())) &&
                      (U = '\\' + U),
                      ']' !== U ||
                        ('[' !== G.value && '[^' !== G.value) ||
                        (U = '\\' + U),
                      !0 === n.posix &&
                        '!' === U &&
                        '[' === G.value &&
                        (U = '^'),
                      (G.value += U),
                      X({ value: U });
                    continue;
                  }
                  if (1 === B.quotes && '"' !== U) {
                    (U = o.escapeRegex(U)), (G.value += U), X({ value: U });
                    continue;
                  }
                  if ('"' === U) {
                    (B.quotes = 1 === B.quotes ? 0 : 1),
                      !0 === n.keepQuotes && z({ type: 'text', value: U });
                    continue;
                  }
                  if ('(' === U) {
                    Z('parens'), z({ type: 'paren', value: U });
                    continue;
                  }
                  if (')' === U) {
                    if (0 === B.parens && !0 === n.strictBrackets)
                      throw new SyntaxError(c('opening', '('));
                    const e = M[M.length - 1];
                    if (e && B.parens === e.parens + 1) {
                      J(M.pop());
                      continue;
                    }
                    z({
                      type: 'paren',
                      value: U,
                      output: B.parens ? ')' : '\\)',
                    }),
                      Y('parens');
                    continue;
                  }
                  if ('[' === U) {
                    if (!0 !== n.nobracket && W().includes(']')) Z('brackets');
                    else {
                      if (!0 !== n.nobracket && !0 === n.strictBrackets)
                        throw new SyntaxError(c('closing', ']'));
                      U = '\\' + U;
                    }
                    z({ type: 'bracket', value: U });
                    continue;
                  }
                  if (']' === U) {
                    if (
                      !0 === n.nobracket ||
                      (G && 'bracket' === G.type && 1 === G.value.length)
                    ) {
                      z({ type: 'text', value: U, output: '\\' + U });
                      continue;
                    }
                    if (0 === B.brackets) {
                      if (!0 === n.strictBrackets)
                        throw new SyntaxError(c('opening', '['));
                      z({ type: 'text', value: U, output: '\\' + U });
                      continue;
                    }
                    Y('brackets');
                    const e = G.value.slice(1);
                    if (
                      (!0 === G.posix ||
                        '^' !== e[0] ||
                        e.includes('/') ||
                        (U = '/' + U),
                      (G.value += U),
                      X({ value: U }),
                      !1 === n.literalBrackets || o.hasRegexChars(e))
                    )
                      continue;
                    const t = o.escapeRegex(G.value);
                    if (
                      ((B.output = B.output.slice(0, -G.value.length)),
                      !0 === n.literalBrackets)
                    ) {
                      (B.output += t), (G.value = t);
                      continue;
                    }
                    (G.value = `(${A}${t}|${G.value})`), (B.output += G.value);
                    continue;
                  }
                  if ('{' === U && !0 !== n.nobrace) {
                    Z('braces');
                    const e = {
                      type: 'brace',
                      value: U,
                      output: '(',
                      outputIndex: B.output.length,
                      tokensIndex: B.tokens.length,
                    };
                    D.push(e), z(e);
                    continue;
                  }
                  if ('}' === U) {
                    const e = D[D.length - 1];
                    if (!0 === n.nobrace || !e) {
                      z({ type: 'text', value: U, output: U });
                      continue;
                    }
                    let t = ')';
                    if (!0 === e.dots) {
                      const e = g.slice(),
                        r = [];
                      for (
                        let t = e.length - 1;
                        t >= 0 && (g.pop(), 'brace' !== e[t].type);
                        t--
                      )
                        'dots' !== e[t].type && r.unshift(e[t].value);
                      (t = p(r, n)), (B.backtrack = !0);
                    }
                    if (!0 !== e.comma && !0 !== e.dots) {
                      const n = B.output.slice(0, e.outputIndex),
                        r = B.tokens.slice(e.tokensIndex);
                      (e.value = e.output = '\\{'),
                        (U = t = '\\}'),
                        (B.output = n);
                      for (const e of r) B.output += e.output || e.value;
                    }
                    z({ type: 'brace', value: U, output: t }),
                      Y('braces'),
                      D.pop();
                    continue;
                  }
                  if ('|' === U) {
                    M.length > 0 && M[M.length - 1].conditions++,
                      z({ type: 'text', value: U });
                    continue;
                  }
                  if (',' === U) {
                    let e = U;
                    const t = D[D.length - 1];
                    t &&
                      'braces' === P[P.length - 1] &&
                      ((t.comma = !0), (e = '|')),
                      z({ type: 'comma', value: U, output: e });
                    continue;
                  }
                  if ('/' === U) {
                    if ('dot' === G.type && B.index === B.start + 1) {
                      (B.start = B.index + 1),
                        (B.consumed = ''),
                        (B.output = ''),
                        g.pop(),
                        (G = h);
                      continue;
                    }
                    z({ type: 'slash', value: U, output: b });
                    continue;
                  }
                  if ('.' === U) {
                    if (B.braces > 0 && 'dot' === G.type) {
                      '.' === G.value && (G.output = _);
                      const e = D[D.length - 1];
                      (G.type = 'dots'),
                        (G.output += U),
                        (G.value += U),
                        (e.dots = !0);
                      continue;
                    }
                    if (
                      B.braces + B.parens === 0 &&
                      'bos' !== G.type &&
                      'slash' !== G.type
                    ) {
                      z({ type: 'text', value: U, output: _ });
                      continue;
                    }
                    z({ type: 'dot', value: U, output: _ });
                    continue;
                  }
                  if ('?' === U) {
                    if (
                      !(G && '(' === G.value) &&
                      !0 !== n.noextglob &&
                      '(' === j() &&
                      '?' !== j(2)
                    ) {
                      V('qmark', U);
                      continue;
                    }
                    if (G && 'paren' === G.type) {
                      const e = j();
                      let t = U;
                      if ('<' === e && !o.supportsLookbehinds())
                        throw new Error(
                          'Node.js v10 or higher is required for regex lookbehinds',
                        );
                      (('(' === G.value && !/[!=<:]/.test(e)) ||
                        ('<' === e && !/<([!=]|\w+>)/.test(W()))) &&
                        (t = '\\' + U),
                        z({ type: 'text', value: U, output: t });
                      continue;
                    }
                    if (
                      !0 !== n.dot &&
                      ('slash' === G.type || 'bos' === G.type)
                    ) {
                      z({ type: 'qmark', value: U, output: T });
                      continue;
                    }
                    z({ type: 'qmark', value: U, output: H });
                    continue;
                  }
                  if ('!' === U) {
                    if (
                      !0 !== n.noextglob &&
                      '(' === j() &&
                      ('?' !== j(2) || !/[!=<:]/.test(j(3)))
                    ) {
                      V('negate', U);
                      continue;
                    }
                    if (!0 !== n.nonegate && 0 === B.index) {
                      q();
                      continue;
                    }
                  }
                  if ('+' === U) {
                    if (!0 !== n.noextglob && '(' === j() && '?' !== j(2)) {
                      V('plus', U);
                      continue;
                    }
                    if ((G && '(' === G.value) || !1 === n.regex) {
                      z({ type: 'plus', value: U, output: E });
                      continue;
                    }
                    if (
                      (G &&
                        ('bracket' === G.type ||
                          'paren' === G.type ||
                          'brace' === G.type)) ||
                      B.parens > 0
                    ) {
                      z({ type: 'plus', value: U });
                      continue;
                    }
                    z({ type: 'plus', value: E });
                    continue;
                  }
                  if ('@' === U) {
                    if (!0 !== n.noextglob && '(' === j() && '?' !== j(2)) {
                      z({ type: 'at', extglob: !0, value: U, output: '' });
                      continue;
                    }
                    z({ type: 'text', value: U });
                    continue;
                  }
                  if ('*' !== U) {
                    ('$' !== U && '^' !== U) || (U = '\\' + U);
                    const e = i.exec(W());
                    e && ((U += e[0]), (B.index += e[0].length)),
                      z({ type: 'text', value: U });
                    continue;
                  }
                  if (G && ('globstar' === G.type || !0 === G.star)) {
                    (G.type = 'star'),
                      (G.star = !0),
                      (G.value += U),
                      (G.output = I),
                      (B.backtrack = !0),
                      (B.globstar = !0),
                      Q(U);
                    continue;
                  }
                  let t = W();
                  if (!0 !== n.noextglob && /^\([^?]/.test(t)) {
                    V('star', U);
                    continue;
                  }
                  if ('star' === G.type) {
                    if (!0 === n.noglobstar) {
                      Q(U);
                      continue;
                    }
                    const r = G.prev,
                      o = r.prev,
                      s = 'slash' === r.type || 'bos' === r.type,
                      a = o && ('star' === o.type || 'globstar' === o.type);
                    if (!0 === n.bash && (!s || (t[0] && '/' !== t[0]))) {
                      z({ type: 'star', value: U, output: '' });
                      continue;
                    }
                    const i =
                        B.braces > 0 &&
                        ('comma' === r.type || 'brace' === r.type),
                      l = M.length && ('pipe' === r.type || 'paren' === r.type);
                    if (!s && 'paren' !== r.type && !i && !l) {
                      z({ type: 'star', value: U, output: '' });
                      continue;
                    }
                    for (; '/**' === t.slice(0, 3); ) {
                      const n = e[B.index + 4];
                      if (n && '/' !== n) break;
                      (t = t.slice(3)), Q('/**', 3);
                    }
                    if ('bos' === r.type && K()) {
                      (G.type = 'globstar'),
                        (G.value += U),
                        (G.output = L(n)),
                        (B.output = G.output),
                        (B.globstar = !0),
                        Q(U);
                      continue;
                    }
                    if (
                      'slash' === r.type &&
                      'bos' !== r.prev.type &&
                      !a &&
                      K()
                    ) {
                      (B.output = B.output.slice(
                        0,
                        -(r.output + G.output).length,
                      )),
                        (r.output = '(?:' + r.output),
                        (G.type = 'globstar'),
                        (G.output = L(n) + (n.strictSlashes ? ')' : '|$)')),
                        (G.value += U),
                        (B.globstar = !0),
                        (B.output += r.output + G.output),
                        Q(U);
                      continue;
                    }
                    if (
                      'slash' === r.type &&
                      'bos' !== r.prev.type &&
                      '/' === t[0]
                    ) {
                      const e = void 0 !== t[1] ? '|$' : '';
                      (B.output = B.output.slice(
                        0,
                        -(r.output + G.output).length,
                      )),
                        (r.output = '(?:' + r.output),
                        (G.type = 'globstar'),
                        (G.output = `${L(n)}${b}|${b}${e})`),
                        (G.value += U),
                        (B.output += r.output + G.output),
                        (B.globstar = !0),
                        Q(U + F()),
                        z({ type: 'slash', value: '/', output: '' });
                      continue;
                    }
                    if ('bos' === r.type && '/' === t[0]) {
                      (G.type = 'globstar'),
                        (G.value += U),
                        (G.output = `(?:^|${b}|${L(n)}${b})`),
                        (B.output = G.output),
                        (B.globstar = !0),
                        Q(U + F()),
                        z({ type: 'slash', value: '/', output: '' });
                      continue;
                    }
                    (B.output = B.output.slice(0, -G.output.length)),
                      (G.type = 'globstar'),
                      (G.output = L(n)),
                      (G.value += U),
                      (B.output += G.output),
                      (B.globstar = !0),
                      Q(U);
                    continue;
                  }
                  const r = { type: 'star', value: U, output: I };
                  !0 !== n.bash
                    ? !G ||
                      ('bracket' !== G.type && 'paren' !== G.type) ||
                      !0 !== n.regex
                      ? ((B.index !== B.start &&
                          'slash' !== G.type &&
                          'dot' !== G.type) ||
                          ('dot' === G.type
                            ? ((B.output += S), (G.output += S))
                            : !0 === n.dot
                            ? ((B.output += w), (G.output += w))
                            : ((B.output += $), (G.output += $)),
                          '*' !== j() && ((B.output += C), (G.output += C))),
                        z(r))
                      : ((r.output = U), z(r))
                    : ((r.output = '.*?'),
                      ('bos' !== G.type && 'slash' !== G.type) ||
                        (r.output = $ + r.output),
                      z(r));
                }
                for (; B.brackets > 0; ) {
                  if (!0 === n.strictBrackets)
                    throw new SyntaxError(c('closing', ']'));
                  (B.output = o.escapeLast(B.output, '[')), Y('brackets');
                }
                for (; B.parens > 0; ) {
                  if (!0 === n.strictBrackets)
                    throw new SyntaxError(c('closing', ')'));
                  (B.output = o.escapeLast(B.output, '(')), Y('parens');
                }
                for (; B.braces > 0; ) {
                  if (!0 === n.strictBrackets)
                    throw new SyntaxError(c('closing', '}'));
                  (B.output = o.escapeLast(B.output, '{')), Y('braces');
                }
                if (
                  (!0 === n.strictSlashes ||
                    ('star' !== G.type && 'bracket' !== G.type) ||
                    z({ type: 'maybe_slash', value: '', output: b + '?' }),
                  !0 === B.backtrack)
                ) {
                  B.output = '';
                  for (const e of B.tokens)
                    (B.output += null != e.output ? e.output : e.value),
                      e.suffix && (B.output += e.suffix);
                }
                return B;
              };
            (f.fastpaths = (e, t) => {
              const n = { ...t },
                a =
                  'number' == typeof n.maxLength ? Math.min(s, n.maxLength) : s,
                i = e.length;
              if (i > a)
                throw new SyntaxError(
                  `Input length: ${i}, exceeds maximum allowed length: ${a}`,
                );
              e = u[e] || e;
              const l = o.isWindows(t),
                {
                  DOT_LITERAL: p,
                  SLASH_LITERAL: c,
                  ONE_CHAR: f,
                  DOTS_SLASH: d,
                  NO_DOT: h,
                  NO_DOTS: g,
                  NO_DOTS_SLASH: A,
                  STAR: R,
                  START_ANCHOR: y,
                } = r.globChars(l),
                m = n.dot ? g : h,
                _ = n.dot ? A : h,
                E = n.capture ? '' : '?:';
              let b = !0 === n.bash ? '.*?' : R;
              n.capture && (b = `(${b})`);
              const C = (e) =>
                  !0 === e.noglobstar
                    ? b
                    : `(${E}(?:(?!${y}${e.dot ? d : p}).)*?)`,
                x = (e) => {
                  switch (e) {
                    case '*':
                      return `${m}${f}${b}`;
                    case '.*':
                      return `${p}${f}${b}`;
                    case '*.*':
                      return `${m}${b}${p}${f}${b}`;
                    case '*/*':
                      return `${m}${b}${c}${f}${_}${b}`;
                    case '**':
                      return m + C(n);
                    case '**/*':
                      return `(?:${m}${C(n)}${c})?${_}${f}${b}`;
                    case '**/*.*':
                      return `(?:${m}${C(n)}${c})?${_}${b}${p}${f}${b}`;
                    case '**/.*':
                      return `(?:${m}${C(n)}${c})?${p}${f}${b}`;
                    default: {
                      const t = /^(.*?)\.(\w+)$/.exec(e);
                      if (!t) return;
                      const n = x(t[1]);
                      if (!n) return;
                      return n + p + t[2];
                    }
                  }
                },
                v = o.removePrefix(e, { negated: !1, prefix: '' });
              let S = x(v);
              return S && !0 !== n.strictSlashes && (S += c + '?'), S;
            }),
              (e.exports = f);
          },
          73: (e, t, n) => {
            const r = n(622),
              o = n(910),
              s = n(561),
              a = n(558),
              i = n(240),
              l = (e, t, n = !1) => {
                if (Array.isArray(e)) {
                  const r = e.map((e) => l(e, t, n));
                  return (e) => {
                    for (const t of r) {
                      const n = t(e);
                      if (n) return n;
                    }
                    return !1;
                  };
                }
                const r =
                  (o = e) &&
                  'object' == typeof o &&
                  !Array.isArray(o) &&
                  e.tokens &&
                  e.input;
                var o;
                if ('' === e || ('string' != typeof e && !r))
                  throw new TypeError(
                    'Expected pattern to be a non-empty string',
                  );
                const s = t || {},
                  i = a.isWindows(t),
                  u = r ? l.compileRe(e, t) : l.makeRe(e, t, !1, !0),
                  p = u.state;
                delete u.state;
                let c = () => !1;
                if (s.ignore) {
                  const e = {
                    ...t,
                    ignore: null,
                    onMatch: null,
                    onResult: null,
                  };
                  c = l(s.ignore, e, n);
                }
                const f = (n, r = !1) => {
                  const {
                      isMatch: o,
                      match: a,
                      output: f,
                    } = l.test(n, u, t, { glob: e, posix: i }),
                    d = {
                      glob: e,
                      state: p,
                      regex: u,
                      posix: i,
                      input: n,
                      output: f,
                      match: a,
                      isMatch: o,
                    };
                  return (
                    'function' == typeof s.onResult && s.onResult(d),
                    !1 === o
                      ? ((d.isMatch = !1), !!r && d)
                      : c(n)
                      ? ('function' == typeof s.onIgnore && s.onIgnore(d),
                        (d.isMatch = !1),
                        !!r && d)
                      : ('function' == typeof s.onMatch && s.onMatch(d),
                        !r || d)
                  );
                };
                return n && (f.state = p), f;
              };
            (l.test = (e, t, n, { glob: r, posix: o } = {}) => {
              if ('string' != typeof e)
                throw new TypeError('Expected input to be a string');
              if ('' === e) return { isMatch: !1, output: '' };
              const s = n || {},
                i = s.format || (o ? a.toPosixSlashes : null);
              let u = e === r,
                p = u && i ? i(e) : e;
              return (
                !1 === u && ((p = i ? i(e) : e), (u = p === r)),
                (!1 !== u && !0 !== s.capture) ||
                  (u =
                    !0 === s.matchBase || !0 === s.basename
                      ? l.matchBase(e, t, n, o)
                      : t.exec(p)),
                { isMatch: Boolean(u), match: u, output: p }
              );
            }),
              (l.matchBase = (e, t, n, o = a.isWindows(n)) =>
                (t instanceof RegExp ? t : l.makeRe(t, n)).test(r.basename(e))),
              (l.isMatch = (e, t, n) => l(t, n)(e)),
              (l.parse = (e, t) =>
                Array.isArray(e)
                  ? e.map((e) => l.parse(e, t))
                  : s(e, { ...t, fastpaths: !1 })),
              (l.scan = (e, t) => o(e, t)),
              (l.compileRe = (e, t, n = !1, r = !1) => {
                if (!0 === n) return e.output;
                const o = t || {},
                  s = o.contains ? '' : '^',
                  a = o.contains ? '' : '$';
                let i = `${s}(?:${e.output})${a}`;
                e && !0 === e.negated && (i = `^(?!${i}).*$`);
                const u = l.toRegex(i, t);
                return !0 === r && (u.state = e), u;
              }),
              (l.makeRe = (e, t, n = !1, r = !1) => {
                if (!e || 'string' != typeof e)
                  throw new TypeError('Expected a non-empty string');
                const o = t || {};
                let a,
                  i = { negated: !1, fastpaths: !0 },
                  u = '';
                return (
                  e.startsWith('./') &&
                    ((e = e.slice(2)), (u = i.prefix = './')),
                  !1 === o.fastpaths ||
                    ('.' !== e[0] && '*' !== e[0]) ||
                    (a = s.fastpaths(e, t)),
                  void 0 === a
                    ? ((i = s(e, t)), (i.prefix = u + (i.prefix || '')))
                    : (i.output = a),
                  l.compileRe(i, t, n, r)
                );
              }),
              (l.toRegex = (e, t) => {
                try {
                  const n = t || {};
                  return new RegExp(e, n.flags || (n.nocase ? 'i' : ''));
                } catch (e) {
                  if (t && !0 === t.debug) throw e;
                  return /$^/;
                }
              }),
              (l.constants = i),
              (e.exports = l);
          },
          910: (e, t, n) => {
            const r = n(558),
              {
                CHAR_ASTERISK: o,
                CHAR_AT: s,
                CHAR_BACKWARD_SLASH: a,
                CHAR_COMMA: i,
                CHAR_DOT: l,
                CHAR_EXCLAMATION_MARK: u,
                CHAR_FORWARD_SLASH: p,
                CHAR_LEFT_CURLY_BRACE: c,
                CHAR_LEFT_PARENTHESES: f,
                CHAR_LEFT_SQUARE_BRACKET: d,
                CHAR_PLUS: h,
                CHAR_QUESTION_MARK: g,
                CHAR_RIGHT_CURLY_BRACE: A,
                CHAR_RIGHT_PARENTHESES: R,
                CHAR_RIGHT_SQUARE_BRACKET: y,
              } = n(240),
              m = (e) => e === p || e === a,
              _ = (e) => {
                !0 !== e.isPrefix && (e.depth = e.isGlobstar ? 1 / 0 : 1);
              };
            e.exports = (e, t) => {
              const n = t || {},
                E = e.length - 1,
                b = !0 === n.parts || !0 === n.scanToEnd,
                C = [],
                x = [],
                v = [];
              let S,
                w,
                H = e,
                T = -1,
                O = 0,
                k = 0,
                L = !1,
                $ = !1,
                N = !1,
                I = !1,
                B = !1,
                M = !1,
                D = !1,
                P = !1,
                U = !1,
                G = 0,
                K = { value: '', depth: 0, isGlob: !1 };
              const j = () => T >= E,
                F = () => ((S = w), H.charCodeAt(++T));
              for (; T < E; ) {
                let e;
                if (((w = F()), w !== a)) {
                  if (!0 === M || w === c) {
                    for (G++; !0 !== j() && (w = F()); )
                      if (w !== a)
                        if (w !== c) {
                          if (!0 !== M && w === l && (w = F()) === l) {
                            if (
                              ((L = K.isBrace = !0),
                              (N = K.isGlob = !0),
                              (U = !0),
                              !0 === b)
                            )
                              continue;
                            break;
                          }
                          if (!0 !== M && w === i) {
                            if (
                              ((L = K.isBrace = !0),
                              (N = K.isGlob = !0),
                              (U = !0),
                              !0 === b)
                            )
                              continue;
                            break;
                          }
                          if (w === A && (G--, 0 === G)) {
                            (M = !1), (L = K.isBrace = !0), (U = !0);
                            break;
                          }
                        } else G++;
                      else (D = K.backslashes = !0), F();
                    if (!0 === b) continue;
                    break;
                  }
                  if (w !== p) {
                    if (!0 !== n.noext) {
                      if (
                        !0 ===
                          (w === h ||
                            w === s ||
                            w === o ||
                            w === g ||
                            w === u) &&
                        H.charCodeAt(T + 1) === f
                      ) {
                        if (
                          ((N = K.isGlob = !0),
                          (I = K.isExtglob = !0),
                          (U = !0),
                          !0 === b)
                        ) {
                          for (; !0 !== j() && (w = F()); )
                            if (w !== a) {
                              if (w === R) {
                                (N = K.isGlob = !0), (U = !0);
                                break;
                              }
                            } else (D = K.backslashes = !0), (w = F());
                          continue;
                        }
                        break;
                      }
                    }
                    if (w === o) {
                      if (
                        (S === o && (B = K.isGlobstar = !0),
                        (N = K.isGlob = !0),
                        (U = !0),
                        !0 === b)
                      )
                        continue;
                      break;
                    }
                    if (w === g) {
                      if (((N = K.isGlob = !0), (U = !0), !0 === b)) continue;
                      break;
                    }
                    if (w === d)
                      for (; !0 !== j() && (e = F()); )
                        if (e !== a) {
                          if (e === y) {
                            if (
                              (($ = K.isBracket = !0),
                              (N = K.isGlob = !0),
                              (U = !0),
                              !0 === b)
                            )
                              continue;
                            break;
                          }
                        } else (D = K.backslashes = !0), F();
                    if (!0 === n.nonegate || w !== u || T !== O) {
                      if (!0 !== n.noparen && w === f) {
                        if (((N = K.isGlob = !0), !0 === b)) {
                          for (; !0 !== j() && (w = F()); )
                            if (w !== f) {
                              if (w === R) {
                                U = !0;
                                break;
                              }
                            } else (D = K.backslashes = !0), (w = F());
                          continue;
                        }
                        break;
                      }
                      if (!0 === N) {
                        if (((U = !0), !0 === b)) continue;
                        break;
                      }
                    } else (P = K.negated = !0), O++;
                  } else {
                    if (
                      (C.push(T),
                      x.push(K),
                      (K = { value: '', depth: 0, isGlob: !1 }),
                      !0 === U)
                    )
                      continue;
                    if (S === l && T === O + 1) {
                      O += 2;
                      continue;
                    }
                    k = T + 1;
                  }
                } else (D = K.backslashes = !0), (w = F()), w === c && (M = !0);
              }
              !0 === n.noext && ((I = !1), (N = !1));
              let W = H,
                Q = '',
                X = '';
              O > 0 && ((Q = H.slice(0, O)), (H = H.slice(O)), (k -= O)),
                W && !0 === N && k > 0
                  ? ((W = H.slice(0, k)), (X = H.slice(k)))
                  : !0 === N
                  ? ((W = ''), (X = H))
                  : (W = H),
                W &&
                  '' !== W &&
                  '/' !== W &&
                  W !== H &&
                  m(W.charCodeAt(W.length - 1)) &&
                  (W = W.slice(0, -1)),
                !0 === n.unescape &&
                  (X && (X = r.removeBackslashes(X)),
                  W && !0 === D && (W = r.removeBackslashes(W)));
              const q = {
                prefix: Q,
                input: e,
                start: O,
                base: W,
                glob: X,
                isBrace: L,
                isBracket: $,
                isGlob: N,
                isExtglob: I,
                isGlobstar: B,
                negated: P,
              };
              if (
                (!0 === n.tokens &&
                  ((q.maxDepth = 0), m(w) || x.push(K), (q.tokens = x)),
                !0 === n.parts || !0 === n.tokens)
              ) {
                let t;
                for (let r = 0; r < C.length; r++) {
                  const o = t ? t + 1 : O,
                    s = C[r],
                    a = e.slice(o, s);
                  n.tokens &&
                    (0 === r && 0 !== O
                      ? ((x[r].isPrefix = !0), (x[r].value = Q))
                      : (x[r].value = a),
                    _(x[r]),
                    (q.maxDepth += x[r].depth)),
                    (0 === r && '' === a) || v.push(a),
                    (t = s);
                }
                if (t && t + 1 < e.length) {
                  const r = e.slice(t + 1);
                  v.push(r),
                    n.tokens &&
                      ((x[x.length - 1].value = r),
                      _(x[x.length - 1]),
                      (q.maxDepth += x[x.length - 1].depth));
                }
                (q.slashes = C), (q.parts = v);
              }
              return q;
            };
          },
          558: (e, t, n) => {
            const r = n(622),
              o = 'win32' === process.platform,
              {
                REGEX_BACKSLASH: s,
                REGEX_REMOVE_BACKSLASH: a,
                REGEX_SPECIAL_CHARS: i,
                REGEX_SPECIAL_CHARS_GLOBAL: l,
              } = n(240);
            (t.isObject = (e) =>
              null !== e && 'object' == typeof e && !Array.isArray(e)),
              (t.hasRegexChars = (e) => i.test(e)),
              (t.isRegexChar = (e) => 1 === e.length && t.hasRegexChars(e)),
              (t.escapeRegex = (e) => e.replace(l, '\\$1')),
              (t.toPosixSlashes = (e) => e.replace(s, '/')),
              (t.removeBackslashes = (e) =>
                e.replace(a, (e) => ('\\' === e ? '' : e))),
              (t.supportsLookbehinds = () => {
                const e = process.version.slice(1).split('.').map(Number);
                return (
                  (3 === e.length && e[0] >= 9) || (8 === e[0] && e[1] >= 10)
                );
              }),
              (t.isWindows = (e) =>
                e && 'boolean' == typeof e.windows
                  ? e.windows
                  : !0 === o || '\\' === r.sep),
              (t.escapeLast = (e, n, r) => {
                const o = e.lastIndexOf(n, r);
                return -1 === o
                  ? e
                  : '\\' === e[o - 1]
                  ? t.escapeLast(e, n, o - 1)
                  : `${e.slice(0, o)}\\${e.slice(o)}`;
              }),
              (t.removePrefix = (e, t = {}) => {
                let n = e;
                return (
                  n.startsWith('./') && ((n = n.slice(2)), (t.prefix = './')), n
                );
              }),
              (t.wrapOutput = (e, t = {}, n = {}) => {
                let r = `${n.contains ? '' : '^'}(?:${e})${
                  n.contains ? '' : '$'
                }`;
                return !0 === t.negated && (r = `(?:^(?!${r}).*$)`), r;
              });
          },
          543: (e, t, n) => {
            /*!
             * to-regex-range <https://github.com/micromatch/to-regex-range>
             *
             * Copyright (c) 2015-present, Jon Schlinkert.
             * Released under the MIT License.
             */
            const r = n(651),
              o = (e, t, n) => {
                if (!1 === r(e))
                  throw new TypeError(
                    'toRegexRange: expected the first argument to be a number',
                  );
                if (void 0 === t || e === t) return String(e);
                if (!1 === r(t))
                  throw new TypeError(
                    'toRegexRange: expected the second argument to be a number.',
                  );
                let s = { relaxZeros: !0, ...n };
                'boolean' == typeof s.strictZeros &&
                  (s.relaxZeros = !1 === s.strictZeros);
                let l =
                  e +
                  ':' +
                  t +
                  '=' +
                  String(s.relaxZeros) +
                  String(s.shorthand) +
                  String(s.capture) +
                  String(s.wrap);
                if (o.cache.hasOwnProperty(l)) return o.cache[l].result;
                let u = Math.min(e, t),
                  p = Math.max(e, t);
                if (1 === Math.abs(u - p)) {
                  let n = e + '|' + t;
                  return s.capture ? `(${n})` : !1 === s.wrap ? n : `(?:${n})`;
                }
                let c = h(e) || h(t),
                  f = { min: e, max: t, a: u, b: p },
                  d = [],
                  g = [];
                if (
                  (c && ((f.isPadded = c), (f.maxLen = String(f.max).length)),
                  u < 0)
                ) {
                  (g = a(p < 0 ? Math.abs(p) : 1, Math.abs(u), f, s)),
                    (u = f.a = 0);
                }
                return (
                  p >= 0 && (d = a(u, p, f, s)),
                  (f.negatives = g),
                  (f.positives = d),
                  (f.result = (function (e, t, n) {
                    let r = i(e, t, '-', !1, n) || [],
                      o = i(t, e, '', !1, n) || [],
                      s = i(e, t, '-?', !0, n) || [];
                    return r.concat(s).concat(o).join('|');
                  })(g, d, s)),
                  !0 === s.capture
                    ? (f.result = `(${f.result})`)
                    : !1 !== s.wrap &&
                      d.length + g.length > 1 &&
                      (f.result = `(?:${f.result})`),
                  (o.cache[l] = f),
                  f.result
                );
              };
            function s(e, t, n) {
              if (e === t) return { pattern: e, count: [], digits: 0 };
              let r = (function (e, t) {
                  let n = [];
                  for (let r = 0; r < e.length; r++) n.push([e[r], t[r]]);
                  return n;
                })(e, t),
                o = r.length,
                s = '',
                a = 0;
              for (let e = 0; e < o; e++) {
                let [t, o] = r[e];
                t === o
                  ? (s += t)
                  : '0' !== t || '9' !== o
                  ? (s += d(t, o, n))
                  : a++;
              }
              return (
                a && (s += !0 === n.shorthand ? '\\d' : '[0-9]'),
                { pattern: s, count: [a], digits: o }
              );
            }
            function a(e, t, n, r) {
              let o,
                a = (function (e, t) {
                  let n = 1,
                    r = 1,
                    o = p(e, n),
                    s = new Set([t]);
                  for (; e <= o && o <= t; ) s.add(o), (n += 1), (o = p(e, n));
                  for (o = c(t + 1, r) - 1; e < o && o <= t; )
                    s.add(o), (r += 1), (o = c(t + 1, r) - 1);
                  return (s = [...s]), s.sort(l), s;
                })(e, t),
                i = [],
                u = e;
              for (let e = 0; e < a.length; e++) {
                let t = a[e],
                  l = s(String(u), String(t), r),
                  p = '';
                n.isPadded || !o || o.pattern !== l.pattern
                  ? (n.isPadded && (p = g(t, n, r)),
                    (l.string = p + l.pattern + f(l.count)),
                    i.push(l),
                    (u = t + 1),
                    (o = l))
                  : (o.count.length > 1 && o.count.pop(),
                    o.count.push(l.count[0]),
                    (o.string = o.pattern + f(o.count)),
                    (u = t + 1));
              }
              return i;
            }
            function i(e, t, n, r, o) {
              let s = [];
              for (let o of e) {
                let { string: e } = o;
                r || u(t, 'string', e) || s.push(n + e),
                  r && u(t, 'string', e) && s.push(n + e);
              }
              return s;
            }
            function l(e, t) {
              return e > t ? 1 : t > e ? -1 : 0;
            }
            function u(e, t, n) {
              return e.some((e) => e[t] === n);
            }
            function p(e, t) {
              return Number(String(e).slice(0, -t) + '9'.repeat(t));
            }
            function c(e, t) {
              return e - (e % Math.pow(10, t));
            }
            function f(e) {
              let [t = 0, n = ''] = e;
              return n || t > 1 ? `{${t + (n ? ',' + n : '')}}` : '';
            }
            function d(e, t, n) {
              return `[${e}${t - e == 1 ? '' : '-'}${t}]`;
            }
            function h(e) {
              return /^-?(0+)\d/.test(e);
            }
            function g(e, t, n) {
              if (!t.isPadded) return e;
              let r = Math.abs(t.maxLen - String(e).length),
                o = !1 !== n.relaxZeros;
              switch (r) {
                case 0:
                  return '';
                case 1:
                  return o ? '0?' : '0';
                case 2:
                  return o ? '0{0,2}' : '00';
                default:
                  return o ? `0{0,${r}}` : `0{${r}}`;
              }
            }
            (o.cache = {}),
              (o.clearCache = () => (o.cache = {})),
              (e.exports = o);
          },
          622: (e) => {
            e.exports = require('path');
          },
          669: (e) => {
            e.exports = require('util');
          },
        },
        t = {};
      function n(r) {
        if (t[r]) return t[r].exports;
        var o = (t[r] = { exports: {} });
        return e[r](o, o.exports, n), o.exports;
      }
      return (
        (n.n = (e) => {
          var t = e && e.__esModule ? () => e.default : () => e;
          return n.d(t, { a: t }), t;
        }),
        (n.d = (e, t) => {
          for (var r in t)
            n.o(t, r) &&
              !n.o(e, r) &&
              Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
        }),
        (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
        (n.r = (e) => {
          'undefined' != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(e, '__esModule', { value: !0 });
        }),
        n(660)
      );
    })();
    return plugin;
  },
};
