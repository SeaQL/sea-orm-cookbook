// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="000-sea-orm-cookbook.html"><strong aria-hidden="true">1.</strong> SeaORM Cookbook</a></li><li class="chapter-item expanded "><a href="001-how-to-load-nested-relation.html"><strong aria-hidden="true">2.</strong> How to load nested relation?</a></li><li class="chapter-item expanded "><a href="002-conflicting-impl-from-model-or-into-active-model.html"><strong aria-hidden="true">3.</strong> Conflicting implementation of From&lt;M&gt; or IntoActiveModel&lt;A&gt;</a></li><li class="chapter-item expanded "><a href="003-run-sea-query-statement-on-sea-orm.html"><strong aria-hidden="true">4.</strong> How to run SeaQuery statement on SeaORM?</a></li><li class="chapter-item expanded "><a href="004-entity-without-primary-key-column.html"><strong aria-hidden="true">5.</strong> Entity without primary key column</a></li><li class="chapter-item expanded "><a href="005-selct-row-matching-any-enum-values.html"><strong aria-hidden="true">6.</strong> Select rows matching any of the enum values</a></li><li class="chapter-item expanded "><a href="006-set-column-value-with-db-value.html"><strong aria-hidden="true">7.</strong> Set column value with database function</a></li><li class="chapter-item expanded "><a href="007-run-migration-at-app-startup.html"><strong aria-hidden="true">8.</strong> Run migration at application startup</a></li><li class="chapter-item expanded "><a href="008-iden-trait-is-not-implemented.html"><strong aria-hidden="true">9.</strong> Iden trait is not implemented</a></li><li class="chapter-item expanded "><a href="010-stream-query-result-no-method-named-try-next.html"><strong aria-hidden="true">10.</strong> Stream query result - no method named try_next</a></li><li class="chapter-item expanded "><a href="011-how-to-mutate-the-underlying-sea-query-statement.html"><strong aria-hidden="true">11.</strong> How to mutate the underlying SeaQuery statement?</a></li><li class="chapter-item expanded "><a href="012-how-to-define-a-struct-with-derive-into-active-model-outside-entity-module.html"><strong aria-hidden="true">12.</strong> How to define a struct with DeriveIntoActiveModel outside entity module?</a></li><li class="chapter-item expanded "><a href="013-static-connection-pool.html"><strong aria-hidden="true">13.</strong> Static Connection</a></li><li class="chapter-item expanded "><a href="014-custom-expression-and-function.html"><strong aria-hidden="true">14.</strong> Custom Expression and Function</a></li><li class="chapter-item expanded "><a href="015-lazy-connection.html"><strong aria-hidden="true">15.</strong> Create database connections lazily</a></li><li class="chapter-item expanded "><a href="016-search-path.html"><strong aria-hidden="true">16.</strong> Configure search_path in PostgreSQL</a></li><li class="chapter-item expanded "><a href="017-auto-execution-of-command-after-connection.html"><strong aria-hidden="true">17.</strong> Automatically execute SQL after connecting to database</a></li><li class="chapter-item expanded "><a href="018-raw-and-unprepared.html"><strong aria-hidden="true">18.</strong> Raw and Unprepared Statements</a></li><li class="chapter-item expanded "><a href="019-select-json-or-tuple-query-result.html"><strong aria-hidden="true">19.</strong> Select JSON or tuple query result</a></li><li class="chapter-item expanded "><a href="020-column-set-check.html"><strong aria-hidden="true">20.</strong> Check if columns are set</a></li><li class="chapter-item expanded "><a href="021-count-select-result.html"><strong aria-hidden="true">21.</strong> Count the number of select result without fetching</a></li><li class="chapter-item expanded "><a href="022-bulk-active-model-field-setting.html"><strong aria-hidden="true">22.</strong> Bulk ActiveModel field setting</a></li><li class="chapter-item expanded "><a href="023-database-change-capture.html"><strong aria-hidden="true">23.</strong> Database Change Capture</a></li><li class="chapter-item expanded "><a href="024-define-newtypes.html"><strong aria-hidden="true">24.</strong> Defining newtypes</a></li><li class="chapter-item expanded "><a href="025-behaviors-not-being-triggered.html"><strong aria-hidden="true">25.</strong> ActiveModelBehavior not being triggered</a></li><li class="chapter-item expanded "><a href="026-subquery.html"><strong aria-hidden="true">26.</strong> Subquery</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
