/**
 * Decorative hero background: the "Creation of Adam" reaching hands, rendered as
 * a dot-matrix (à la a tiled-dot wallpaper). The left hand is human; the right
 * hand is robotic — panel seams and articulated knuckle joints — a nod to the
 * human/AI theme. Both hands gently breathe and reach toward each other, with a
 * pulsing spark where the fingertips almost touch.
 *
 * Purely decorative: aria-hidden, pointer-events-none, sits behind hero content.
 * Honors prefers-reduced-motion via the global rule in index.css.
 *
 * Hand silhouettes are Font Awesome Free pointing-hand icons (CC BY 4.0),
 * positioned so the extended index fingers nearly meet in the centre.
 */

// Font Awesome "hand-point-right" / "hand-point-left" (512×512), used as the
// human (left) and robot (right) silhouettes respectively.
const HAND_RIGHT =
  'M480 96c17.7 0 32 14.3 32 32s-14.3 32-32 32l-208 0 0-64 208 0zM320 288c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0zm64-64c0 17.7-14.3 32-32 32l-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l48 0c17.7 0 32 14.3 32 32zM288 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0zm-88-96l.6 0c-5.4 9.4-8.6 20.3-8.6 32c0 13.2 4 25.4 10.8 35.6C177.9 364.3 160 388.1 160 416c0 11.7 3.1 22.6 8.6 32l-8.6 0C71.6 448 0 376.4 0 288l0-61.7c0-42.4 16.9-83.1 46.9-113.1l11.6-11.6C82.5 77.5 115.1 64 149 64l27 0c35.3 0 64 28.7 64 64l0 88c0 22.1-17.9 40-40 40s-40-17.9-40-40l0-56c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 56c0 39.8 32.2 72 72 72z'

const HAND_LEFT =
  'M32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l208 0 0-64L32 96zM192 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0zm-64-64c0 17.7 14.3 32 32 32l48 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-48 0c-17.7 0-32 14.3-32 32zm96 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0zm88-96l-.6 0c5.4 9.4 8.6 20.3 8.6 32c0 13.2-4 25.4-10.8 35.6c24.9 8.7 42.8 32.5 42.8 60.4c0 11.7-3.1 22.6-8.6 32l8.6 0c88.4 0 160-71.6 160-160l0-61.7c0-42.4-16.9-83.1-46.9-113.1l-11.6-11.6C429.5 77.5 396.9 64 363 64l-27 0c-35.3 0-64 28.7-64 64l0 88c0 22.1 17.9 40 40 40s40-17.9 40-40l0-56c0-8.8 7.2-16 16-16s16 7.2 16 16l0 56c0 39.8-32.2 72-72 72z'

const HUMAN_TRANSFORM = 'translate(324,315) scale(0.9)'
const ROBOT_TRANSFORM = 'translate(820,315) scale(0.9)'

export default function CreationBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none text-stone-400 dark:text-cream-200 opacity-[0.45] dark:opacity-[0.13]"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* The dot grid that fills each hand */}
          <pattern id="cb-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2.1" fill="currentColor" />
          </pattern>

          <mask id="cb-human-mask">
            <rect width="1600" height="900" fill="black" />
            <path d={HAND_RIGHT} transform={HUMAN_TRANSFORM} fill="white" />
          </mask>

          <mask id="cb-robot-mask">
            <rect width="1600" height="900" fill="black" />
            <path d={HAND_LEFT} transform={ROBOT_TRANSFORM} fill="white" />
          </mask>

          <clipPath id="cb-robot-clip">
            <path d={HAND_LEFT} transform={ROBOT_TRANSFORM} />
          </clipPath>
        </defs>

        {/* slow overall drift so the whole scene feels alive */}
        <g className="cb-drift">
          {/* Human hand — dot fill */}
          <g className="cb-human">
            <rect width="1600" height="900" fill="url(#cb-dots)" mask="url(#cb-human-mask)" />
          </g>

          {/* Robot hand — dot fill + mechanical panels and knuckle joints */}
          <g className="cb-robot">
            <rect width="1600" height="900" fill="url(#cb-dots)" mask="url(#cb-robot-mask)" />
            <g
              clipPath="url(#cb-robot-clip)"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              opacity="0.7"
            >
              {/* panel seams */}
              <path d="M900 360 L900 720 M980 360 L980 720 M1060 360 L1060 720 M1140 360 L1140 720 M1220 360 L1220 720" />
              <path d="M800 470 L1300 470 M800 540 L1300 540 M800 620 L1300 620" />
            </g>
            {/* articulated knuckle joints along the extended finger */}
            <g clipPath="url(#cb-robot-clip)" fill="currentColor" opacity="0.85">
              <circle cx="885" cy="430" r="7" />
              <circle cx="955" cy="430" r="7" />
              <circle cx="1025" cy="430" r="7" />
            </g>
          </g>

          {/* spark where the fingertips almost touch */}
          <circle className="cb-spark" cx="802" cy="430" r="6" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}
