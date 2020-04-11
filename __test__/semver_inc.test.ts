import semver from "semver"
import { execSync } from "child_process"

const semverCommands = ["major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease"] as const
type iSemverInc = typeof semverCommands[number]

describe(semver_inc.name, () => {
  describe('validation', () => {
    const coreNumbers = [0, 1]
    for (const command of semverCommands)
      for (const major of coreNumbers)
        for (const minor of coreNumbers)
          for (const patch of coreNumbers)
            for (const prerelease of coreNumbers.map(v => v ? `-${v}` : '')) {
              const version = [major, minor, patch].join('.') + prerelease

              it(`${command} ${version}`, () => expect(semver_inc(
                command, [
                  `${
                    Math.random() > 0.5 ? 'v' : ''
                  }${
                    version
                  }`
              ]
              )).toBe(
                semver.inc(version, command)
              ))
            }
  })

  describe("scenario 1", () => {
    const start = "1.0.0"
    , scenario: [iSemverInc, string][] = [
      ["minor", "v1.1.0"],
      ["preminor", "1.2.0-0"],
      ["patch", "v1.1.1"],
      ["prerelease", "1.2.0-1"],
      ["patch", "v1.1.2"],
      ["minor", "1.2.0"]
    ]

    for (let i = 0; i < scenario.length; i++)
      it(scenario[i].join(' '), () => expect(semver_inc(
        scenario[i][0],
        [start, ...scenario.slice(0, i).map(([_,tag]) => tag)]
        .sort(semverSort)
      )).toBe(
        _v(scenario[i][1])
      ))
  })
  
  describe("bad command", () => {
    it("release", () => expect(() => semver_inc(
      //@ts-ignore,
      "release",
      ["v0.1.0"]
    )).toThrow())
  })
})

function semver_inc(inc: iSemverInc, tags: string[]) {
  return execSync(`echo "${tags.join("\n")}" | xargs -d \\n -n1 echo | ./utils/semver_inc ${inc}`)
  .toString()
  .replace(/\n$/, '')
}

function semverSort(v1: string, v2: string) {
  return v1 === v2 ? 0 : semver.gt(_v(v1), _v(v2)) ? -1 : 1
}

function _v(v: string) {
  return v.replace(/^v/, "")
}