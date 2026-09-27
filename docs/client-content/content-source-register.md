# Content-source register

Internal editorial record, 21 September 2026. Not a public download.
All six supplied files were read before website edits. Page references below are physical PDF pages (1-based), not printed footers: the 2026 PDF has 16 pages and its printed numbering shifts after Brett's inserted biography. Publisher has 15 pages; both Creating Solutions versions have 14 slides/pages.

## Storage and source handling

Originals were moved intact from `public/docs/` to `docs/client-content/sources/`. Extracted text (including private reference contacts), OOXML media, Publisher streams/images and PDF reference renders are in `extracted/`. Both directories are git-ignored and outside Angular's public assets. The public asset rule also excludes `docs/**`, Publisher, PowerPoint and Word files. No brochure downloads were added. Do not copy reference extracts into runtime content.

Sources: **B** = `^ 2026 Brochure.pdf`; **P** = `Brochure_current.pub`; **S** = `Creating Solutions_current (1).pptx`; **SP** = `Creating Solutions 260715.pdf`; **L** = `Process - Project Life Cycle 231109.pdf`; **H** = `Master Letterhead, THG (1).docx`.

## Usable content

| Fact / publication decision | Source locator |
| --- | --- |
| We Deliver Your Mission | B p1; P p1; H header; L p1 |
| Deliver client mission through people-centric, coordinated teams | B/P pp3–4; B p15 / P p14 |
| Owner interests and program/project oversight, not a blanket general-contractor role | B p15; P p14; S/SP p14 |
| Healthcare focus; Southern California primary market with flexibility elsewhere | S/SP p1 and healthcare examples; B pp5–11; geographic positioning explicitly supplied in this task |
| Program Management: coordinate related projects around client purpose | B p15; P p14; S/SP p14 |
| Design Management: guide design and team around client needs, duration, milestones and cost | B p15; P p14; S/SP p14 |
| Construction Management: scope, quality, schedule, cost, safety, function; owner oversight | B p15; P p14; S/SP p14 |
| Contract Management: develop/negotiate agreements for client | S/SP p14 |
| Financial Management through a capital financial advisor partnership; not represented as an in-house advisory practice | S/SP p14 |
| Marc Howell, Partner; planning, design, construction and owner-representation experience | P p5; H signature; B p5 biography |
| Eric Laurin, Partner; healthcare, owner representation, financial tracking | P p8; B p8 |
| Brett Smith; medical/commercial/multifamily construction oversight | B p11. No title supplied; title omitted. Not present in P |
| Eight phases: Project Development → Team Development → Design → Agency Review → Preconstruction → Construction → Close Out → Operation / Patient Ready | S/SP p9; L p1; B p12 / P p11 embedded phase diagram |
| Howell can contribute at any stage; early decisions shape delivery | B p12, p14; P p11, p13; S/SP pp11–12; explicit task direction |
| Detailed eleven steps reserved for future Approach work | S/SP p13; L p1. No Approach route exists, so none added |
| General contact: info@thehowellgroup.co / 949-610-5111 | B/P p1; S/SP p14; H footer |
| Provisional address: 1847 Providence Way, Corona, CA 92878 | Latest email wording as supplied in task; B/P p1. See conflict below |

Implementation: `core/data/company.data.ts` uses existing `Service` and `TeamMember` CMS contracts plus typed company/phases. Homepage, navigation, footer and minimal service-index adapters share these records. Existing `core/data/projects.data.ts` remains the only portfolio collection. No new portfolio entries, invented titles, testimonials, client strips or company totals were added. The homepage uses this curated project collection for SSR and browser rendering instead of fictional samples or unreviewed API project metadata. Existing insights API remains; fabricated editorial fallbacks are withheld.

## Conflicts / withheld claims

| Issue | Conflicting evidence | Decision / confirmation needed |
| --- | --- | --- |
| ZIP | B/P p1 and latest email wording: 92878; H footer: 92880 | Publish 92878 provisionally; confirm correct mailing ZIP |
| Anaheim budget | B pp5,8: $42M; B pp7,10 and P pp7,10: $30M | Withhold financial figures; confirm scope/date and total vs construction basis |
| Aliso Viejo budget | B pp5,7,8 and P p7: $50M; B/P p10: $45M | Withhold; do not choose one brochure globally |
| Hoag Irvine chiller | B p5: $38M; B/P p7: $3.2M total / $2.7M construction | Withhold; require correction/attribution |
| References | B p16 includes Hoag reference; P p15 instead includes two LADMC references; Anaheim reference title differs | Keep lists/private contacts internal; no testimonials or public reference list |
| Career vs company attribution | B pp5–11 and P pp5–10 are personal experience, including prior organizations and differing roles | No founding date, company age/project count, blanket GC role, completion claim or new project added |
| Additional figures | LADMC budgets vary between P pp6,9 and B pp5–6,8–9,11; B elevator summaries differ internally; Brett's B p11 lists Ingleside twice at different amounts; Hoag Newport $2.6M vs $2.7M | Withhold pending scope/date reconciliation |
| Legacy portfolio metrics | Earlier local records include areas and savings claims not resolved against new source attribution | Remove area figures and financial outcomes from shared project records; retain names, established photo associations, descriptive scope and existing links |
| Statistics / regulatory statements | B p13, P p12; S/SP pp2–8 contain survey, population, reimbursement and regulatory assertions, including differing trust percentages | Not published or treated as verified current facts |
| Professional credentials / affiliations | Individual biography lists and embedded organization logos | No company certifications, awards or affiliations inferred; logos not published |

## Remaining assets and deferred work

- Licensed Franklin Gothic Book webfont plus web-use license is needed. No font files were supplied/found; current stack retained. Embedded document fonts are not redistributed.
- Larger originals of portraits and the Aliso/Anaheim project photos would improve high-density displays. Current portraits retain their source proportions and are intentionally modest in size.
- No new project photos were found in the six documents. Existing photographs are used only for their already documented project associations; no brochure resume entry is promoted to a company project.
- No confirmed company group portrait or project-specific hero photograph: retain neutral architectural/atmospheric decoration for those compositions.
- Confirm Brett's title, ZIP, budget basis, individual/company project attribution and reference-list differences.
- Services landing and detail-page revisions were completed in the subsequent service pass below. The detailed eleven-step Approach explanation remains deferred.

Code reviewed manually for imports, template bindings, data shape, route targets and five-stage animation indexing. No tests, builds, lint, browser audits, commits, pushes or deployments performed.


## Services landing and detail pass

The five existing shared service records now carry typed detail content via `ServiceDetail extends Service`. The landing page, its five cards and scrolling chapters, homepage service list, mega menu/mobile menu and footer all use those names and canonical `/services/:slug` destinations. One reusable lazy-loaded detail template renders coverage, owner support, lifecycle relevance, related services and distinct contact invitations. Missing slugs return a 404 response and noindex metadata. Each valid page sets its own title, description, canonical and structured/visible breadcrumbs. The old `/services/partnership-consulting` URL redirects to `/services` through Angular routing; it is not assigned to one of the new offerings.

| Detail content | Evidence / editorial boundary |
| --- | --- |
| Program priorities, coordinated oversight, decision-making and campus planning | B p15 / P p14; S/SP pp10–12,14. Scope follows program-wide oversight rather than company project totals |
| Design-team coordination, owner/user needs, design development and time/cost alignment | B p15 / P p14; S/SP pp11–14 |
| Construction oversight of scope, quality, schedule, cost, safety and function | B p15 / P p14; S/SP pp13–14; L p1. Owner-side oversight, not a claim to perform all construction |
| Developing and negotiating project agreements | S/SP pp13–14; L p1. No legal representation or legal-advice claims |
| Financial scope: direct investment, private equity/debt, collateralized funding, M&A, divestitures, strategic alliances, management buyouts, recapitalization/refinancing, grants, equipment leasing, energy-as-a-service | S/SP p14 rechecked in retained extraction for this specific detail gap. Every financial page clearly retains the capital financial advisor partnership; no direct-lender or funding guarantee claims |
| Eight-phase sequence | Shared PROJECT_PHASES, S/SP p9 and L p1. Service-specific phase notes are concise editorial applications of the scope and lifecycle, not a new methodology or fixed deliverable promise. Financial notes describe possible timing around capital needs |
| Program related experience: LADMC | P p6 / B p6: Marc's planning/program management for the campus program. Presented as individual professional experience, not company contractual attribution |
| Construction related experience: KPC Global OC | P p6 / B p6: Marc's onsite construction management for operating-room and central-plant work. Same individual-attribution boundary |

No verified company-service association was inferred from a photo. Design, Contract and Financial pages omit related-project sections: no suitable portfolio role association is established. No new project entries, financial figures, reference contacts, testimonials or regulatory assertions were published.

No About, Markets, Projects or Contact content files were changed in this pass. Legacy `partnership-consulting` IDs still exist inside the deferred Markets source records; they are not rendered because the obsolete shared service no longer exists. Reconcile those market-to-service associations in the Markets content pass rather than invent a replacement association here.

Manual code review only: shared destinations, imports/bindings, route reuse, SSR metadata/404 handling and scoped motion cleanup. No tests, builds, lint or browser audits were written/run; no commit, push or deployment.

## About page pass — 22 September 2026

- Purpose and perspective copy: B/P pp3–4, B p15 / P p14; owner interests, people-centric teams, respect, clear responsibilities, communication and collaboration. Southern California healthcare focus and flexibility elsewhere follow the client task wording already recorded above.
- Values: exact “Integrity + Intent + Capabilities + Results = TRUST” from B/P p1 and B p15 / P p14. Four existing interactive panels now follow those four terms; their concise descriptions paraphrase the purpose/people/services sections. No new results statistics or guarantees.
- About biographies expand shared TEAM identities/titles/portraits through the existing typed TeamMember contract in about.data.ts. Only About-specific biography text is local; shared homepage profiles were not changed.
- Marc: B physical p5, planning/programming/design/construction, owner representation and design-bid-build/design-build/progressive design-build/CMAR. Eric: B physical p8, concept-to-closeout, owner representation, teamwork, project financial tracking and client technology integration. Brett: B physical p11, construction oversight, stakeholder interests and medical/commercial/multifamily work. Retained extracted biography text was revisited only for these details absent from the concise register.
- Partner titles for Marc and Eric remain sourced to P pp5,8 and H signature for Marc. Brett's title remains unconfirmed and is omitted. No dated experience totals, company age, founding assertions, project counts, credentials, reference contacts or project-specific career examples were added.
- Approach introduction follows B pp12,14 / P pp11,13. No Approach route exists; the established Services link remains, accurately labeled “Explore our services.” Full lifecycle content is deferred to the next pass.
- About SEO uses existing SeoService with mission-specific title, owner/healthcare description, /about canonical and Home/About breadcrumbs. Existing browser-only animation initialization, matchMedia reduced-motion handling and cleanup remain; the portrait reveal now includes Brett.
- Changed runtime files: about.data.ts and about-page.component.ts/.html/.scss only. Shared header/footer, five services and other pages were not edited in this pass. Manual code review only; no tests, builds, lint, browser audits, commits, pushes or deployment.

## Our Approach page pass — 22 September 2026

- New /our-approach supersedes the About-pass note that no dedicated destination existed. Homepage, About, desktop/mobile About menu and footer now connect to it.
- Framework: L p1 (Process - Project Life Cycle 231109.pdf), S/SP pp/slides 9 and 13 (Creating Solutions). Shared PROJECT_PHASES supplies the eight names and sequence; page-specific typed content retains all eleven steps.
- Mapping: Project Development 1; Team Development 2–4; Design 5; Agency Review 6; Preconstruction 7–8; Construction 9; Close Out 10; Operation / Patient Ready 11. Activities paraphrase the criteria and documents/tools in L p1. No percentage improvements, current regulatory claims or guaranteed outcomes.
- Hero and closing use client-requested wording. Earlier involvement and contributing at any stage follow S/SP p13. Agency and operational activities are conditional on project scope, location and intended use; support does not promise approval, licensing or readiness.
- Diagram is recreated as responsive semantic HTML with eight visible sections, eleven numbered steps and real phase links. No dense PDF screenshot, new image, company-project evidence or private document is published. Related links use existing shared service records.
- Desktop uses a sticky index and scroll progress line; mobile uses an unpinned vertical timeline. Reduced motion shows a static line and no entrance animation. DOM work is browser-only, with event/observer/GSAP cleanup. Metadata uses existing SeoService and breadcrumbs.
- No unresolved phase/step mapping. Applicable approvals and licensing remain project-specific. Manual source/code review only; no tests, builds, lint, browser audits, commits, pushes or deployment.

## Markets pass — 22 September 2026

- Client-supplied categories and internal classification mapping: General Acute Care Buildings — OSHPD 1; Skilled Nursing & Intermediate Care Facilities — OSHPD 2; Licensed Clinics & Outpatient Services — OSHPD 3; Correctional Treatment Centers — OSHPD 4; Acute Psychiatric Hospital Buildings — OSHPD 5. This is the client's mapping, not a verification of current regulatory terminology or jurisdiction. No classification labels are published in this pass.
- Primary Southern California healthcare focus and flexibility elsewhere follow the client's exact overview copy. Detail priorities follow the client's editorial directions and describe considerations, not past work, specialist credentials or guaranteed results.
- Service explanations apply documented Program, Design, Construction and Contract Management scope (B p15 / P p14; S/SP p14) to the stated priorities. All links resolve to shared service records and their detail destinations. No legal representation, direct construction or regulatory-expertise claims added.
- General Acute Care related experience: KPC Global OC operating-room and central-plant work, Marc Howell's onsite construction management, B/P p6 and established project record. Attribution is explicitly individual professional experience. Other four categories omit related-project sections pending both market and role attribution. Aliso imagery illustrates a care setting only; it does not establish a statutory classification or company role.
- Active routes: /markets; /markets/hospitals; /markets/skilled-nursing-intermediate-care; /markets/licensed-clinics-outpatient; /markets/correctional-treatment-centers; /markets/behavioral-health. Hospital and behavioral-health URLs retained. Redundant /markets/healthcare redirects to /markets using the existing Angular redirect convention.
- Original nine-sector data preserved verbatim in markets-draft-before-healthcare.ts.txt, outside public assets and runtime imports. Commercial, residential, railways, education, tenant-improvement and advanced-technologies removed from active navigation/data. These old slugs use the existing 404/noindex template; no unrelated redirects.
- Publication check: local tracked remote history contains the market implementation in origin/development (4026623); no market-data history was returned for origin/main. No deployment configuration/sitemap evidence was found in the repository search. This cannot establish whether old URLs were ever deployed; publication status remains unconfirmed. No remote deployment or browser audit performed.
- Shared desktop/mobile menu derives all five categories from MARKETS. Footer's /markets link remains correct. Contact context already consumes shared MARKETS, so no Contact content changes were needed. SSR unique metadata and breadcrumbs retained/updated. Existing image transitions, massing visuals, mobile cards, reduced-motion styles and cleanup preserved.
- No 27-system client list, statistics, budgets, reference contacts or regulatory claims published. Manual code review only; no tests, builds, lint or browser audits, commits, pushes or deployments.
