"""Produce the public transcript from the private original.

Line numbers are preserved exactly so that every citation (e.g. T1:216)
points at the same passage in both versions. Only personal, domestic and
third-party asides are replaced; no family-history content is
removed. Edit REDACTIONS to change what is withheld.
"""
import sys

MARK = "[Passage withheld from the public copy: {why}. Preserved in the private original.]"

# line number -> (reason) for whole-paragraph removal
WHOLE = {
    64: "personal or domestic aside",
    66: "personal or domestic aside",
    68: "personal or domestic aside",
    70: "personal or domestic aside",
    72: "personal or domestic aside",
    74: "personal or domestic aside",
    76: "personal or domestic aside",
    78: "personal or domestic aside",
    80: "personal or domestic aside",
    304: "personal or domestic aside",
    306: "personal or domestic aside",
    308: "personal or domestic aside",
    310: "personal or domestic aside",
    400: "personal or domestic aside",
    424: "personal or domestic aside",
    426: "personal or domestic aside",
    430: "third-party private matter",
    434: "personal or domestic aside",
    436: "third-party private matter",
    438: "third-party private matter",
    480: "personal or domestic aside",
    482: "personal or domestic aside",
    484: "personal or domestic aside",
    486: "personal or domestic aside",
    588: "third-party private matter",
    590: "third-party private matter",
    592: "third-party private matter",
    594: "third-party private matter",
    596: "third-party private matter",
    598: "third-party private matter",
}

# line number -> (old fragment, new fragment) for partial removal
PARTIAL = {
    82: ("Um, And I was outside shouting distance and it was sheer fluke that somebody came past, okay? And it was as a result of that, but James got these schedules. Which mummy? Which Granny? And I yeah. ",
         "[…personal aside withheld…] "),
    568: ("Um, doesn't doesn't bode too well for me now, especially because of my meatloaf. My Hungarian grandfather as well. Um, but hey, um, ",
          "[…personal aside withheld…] "),
    584: (" Have you pressed it? Sorry. Oh, I thought you're you're impressed. It went off earlier. Yeah, he did press it earlier.",
          " […personal aside withheld…]"),
}

def main(src, dst):
    lines = open(src, encoding="utf-8").read().split("\n")
    for n, why in WHOLE.items():
        assert lines[n - 1].strip(), f"line {n} is empty"
        lines[n - 1] = MARK.format(why=why)
    for n, (old, new) in PARTIAL.items():
        assert old in lines[n - 1], f"fragment not found on line {n}"
        lines[n - 1] = lines[n - 1].replace(old, new)
    open(dst, "w", encoding="utf-8").write("\n".join(lines))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
