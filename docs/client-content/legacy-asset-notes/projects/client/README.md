# Client project photographs

Image-to-project associations verified against https://thehowellgroup.co/projects/
on 14 September 2026. These are the site's client photographs, not the generated
images in the design reference or the fictional homepage samples.

| Project | Original image on thehowellgroup.co |
| --- | --- |
| Aliso Ridge Behavioral Hospital | /wp-content/uploads/2024/01/WS-Photos-P7.2.png |
| Anaheim Community Hospital | /wp-content/uploads/2024/01/WS-Photos-P7.3.png |
| KPC Global OC | /wp-content/uploads/2024/03/Photos-KPC-r1-cover.png |
| Western University Medical School | /wp-content/uploads/2024/03/Photos-Western-r1-cover.png |
| Los Angeles Downtown Medical Center | /wp-content/uploads/2024/03/L-10.jpg |
| KPC Global Chapman | /wp-content/uploads/2024/03/Photos-Chapman-r1-cover.png |

Local WebP copies retain source proportions, use quality 85, and have a maximum
width of 1200 pixels without upscaling. The Aliso and Anaheim source images are
only 682 and 644 pixels wide; higher-resolution originals would improve large
and high-density displays. Card framing uses CSS; the full local image is retained.

The typed collection in src/app/core/data/projects.data.ts is the shared source
for the listing and the upcoming detail template. The configured CMS host did
not resolve during implementation. No categories, location metadata, completion
dates, descriptions, or statistics have been inferred from the photos.

## Detail galleries and published project information

Detail content was sourced on 14 September 2026 from the legacy detail pages
linked directly by the client's Projects index. The collection keeps the names
and stable slugs already used by the new listing.

| New project slug | Legacy source page | Gallery source filenames (under /wp-content/uploads/) |
| --- | --- | --- |
| aliso-ridge-behavioral-hospital | https://thehowellgroup.co/aliso-ridge-behavioral-health/ | 2024/01/WS-Photos-P9.2.png through WS-Photos-P9.9.png, then P9.1.png |
| anaheim-community-hospital | https://thehowellgroup.co/anaheim-community-hospital/ | 2024/01/WS-Photos-P8.1.png through WS-Photos-P8.9.png |
| kpc-global-oc | https://thehowellgroup.co/kpc-global-hospital-orange-county/ | 2024/01/WS-Photos-P10.1.png through P10.9.jpg |
| western-university-medical-school | https://thehowellgroup.co/western-university-simulation-lab/ | 2024/01/WS-Photos-P12.1.jpg through P12.9.jpg |
| los-angeles-downtown-medical-center | https://thehowellgroup.co/los-angeles-downtown-medical-center/ | 2024/03/L1.jpg through L9.jpg (L6 is rotated source) |
| kpc-global-chapman | https://thehowellgroup.co/kpc-global-hospital-chapman/ | 2024/01/WS-Photos-P11.1.png through P11.3.png; 2024/05/Rectangle_99.jpg; P11.7.png through P11.9.png; 2024/03/Photos-Chapman-r1-cover.png; 2024/05/Rectangle_101.jpg |

The detail galleries now use all nine images published on each live project page.
Anaheim, Aliso Ridge, Western University, Los Angeles Downtown, and Chapman use
all nine photos in the published order. KPC OC includes the original 158px P10.1
thumbnail because it is one of the nine images published on that project's page;
its higher-resolution confirmed listing cover remains the detail hero.
All gallery copies retain the original image content and proportions, are
orientation-corrected, and use WebP quality 85 at up to 1600px width without
upscaling. Full images remain available in the modal regardless of card cropping.
Some source images are small, especially Aliso, Anaheim and Chapman; higher
resolution originals remain desirable. None are generated or temporary substitutes.

and is deliberately omitted. No location, Howell role, completion date or current
Project facts and credits now reproduce the wording on the corresponding live
project pages. The LADMC area remains marked unclear because the source says
"+/-50,00". Location, Howell role, and completion are explicitly marked as not
listed where absent. Savings and program values retain source-page wording,
including figures that need client reconciliation; they are not independently
verified as current company-attributable outcomes.

## September 2026 content reconciliation

The shared project collection now withholds numeric areas and financial outcomes
pending reconciliation with the supplied personal-experience brochures. Existing
photo associations and links remain. Internal decisions are recorded outside
public assets in docs/client-content/content-source-register.md.
