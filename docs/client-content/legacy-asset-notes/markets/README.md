# Markets assets and content

The nine market names and their relationship semantics come from the user brief.
Market images illustrate environments; they are not a completed-project gallery
or evidence of company experience in every sector. Existing client images remain
mapped to their original subjects; source details are in ../projects/client/README.md.
Existing stock architectural images are documented in ../projects/README.md.

Additional illustrative assets:
- Railways: https://images.unsplash.com/photo-1474487548417-781cb71495f3
- Advanced Technologies: https://images.unsplash.com/photo-1558494949-ef010cbdcc31

These were inspected, downloaded at 1400px width and converted to WebP quality 85.
The architectural strip and closing image reuse existing stock architecture assets.
Illustrative imagery does not imply project associations, credentials or delivery claims.

massing.svg is a code-created abstract architectural study. It provides the static
SSR, reduced-motion, touch and WebGL-failure fallback for the demand-rendered
Three.js massing scene. The scene is conceptual, not a client building model.

The typed collection in src/app/core/data/markets.data.ts supplies the overview,
navigation and market detail content. The Healthcare overview is separate
from its Hospitals and Behavioral Health children; Tenant Improvement is cross-sector.

layers.svg supplies the static SSR, mobile, reduced-motion and WebGL-failure
fallback for the detail template's three-layer conceptual study. Both studies use
abstract reusable boxes, not client building geometry.

Detail project relationships use the published scopes already recorded in
src/app/core/data/projects.data.ts: Western University's simulation lab supports
Education; Anaheim and Aliso Ridge support Healthcare and Behavioral Health;
Anaheim and KPC Global OC support Hospitals. Other markets omit relevant work
until project assignments are confirmed. These are explicit curated associations,
not automatic matches inferred from photographs.

The sector consideration copy was written for this brief and needs client editorial
confirmation. Stock Commercial, Residential, Railways and Advanced Technologies
imagery remains temporary illustrative material. Existing client photographs used
as environment examples retain their original subjects; several care photographs
are only about 680px wide and would benefit from higher-resolution originals.

Contact links carry an editable market context. Existing Project Type options are
not changed; preselection occurs only if a valid configured option matches. The
contact form's pre-existing empty required option lists still need client/API data.
