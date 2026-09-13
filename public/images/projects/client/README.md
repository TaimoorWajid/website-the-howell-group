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
| aliso-ridge-behavioral-hospital | https://thehowellgroup.co/aliso-ridge-behavioral-health/ | 2024/01/WS-Photos-P9.2.png, WS-Photos-P9.3.png, WS-Photos-P9.4.jpg |
| anaheim-community-hospital | https://thehowellgroup.co/anaheim-community-hospital/ | 2024/01/WS-Photos-P8.1.png, WS-Photos-P8.2.png, WS-Photos-P8.3.png |
| kpc-global-oc | https://thehowellgroup.co/kpc-global-hospital-orange-county/ | Existing verified listing cover, 2024/01/WS-Photos-P10.2.jpg, WS-Photos-P10.3.jpg |
| western-university-medical-school | https://thehowellgroup.co/western-university-simulation-lab/ | 2024/01/WS-Photos-P12.1.jpg, WS-Photos-P12.2.jpg, WS-Photos-P12.3.jpg |
| los-angeles-downtown-medical-center | https://thehowellgroup.co/los-angeles-downtown-medical-center/ | 2024/03/L1.jpg, L2.jpg, L3.jpg |
| kpc-global-chapman | https://thehowellgroup.co/kpc-global-hospital-chapman/ | 2024/01/WS-Photos-P11.1.png, WS-Photos-P11.2.png, WS-Photos-P11.3.png |

The detail galleries have three assigned images each. The original 158px KPC OC
thumbnail was excluded; its already-verified listing cover is used instead.
All gallery copies retain the original image content and proportions, are
orientation-corrected, and use WebP quality 85 at up to 1600px width without
upscaling. Full images remain available in the modal regardless of card cropping.
Some source images are small, especially Aliso, Anaheim and Chapman; higher
resolution originals remain desirable. None are generated or temporary substitutes.

Scope summaries paraphrase the client's published scope text. Areas are included
only where the original figure is unambiguous. The LADMC area reads "+/-50,00"
and is deliberately omitted. No location, Howell role, completion date or current
project status was inferred. The Aliso, Western and Chapman contribution sections
use their clearly stated historical project savings. KPC OC's inconsistent
financial figure and LADMC's dated "unavailable until 2025" statement are omitted.
Other contribution fields remain absent until approved copy is provided.
