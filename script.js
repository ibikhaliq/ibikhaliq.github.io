// =========================================
//  Ibrahim Khaliq — Portfolio Scripts
// =========================================

(function () {
  "use strict";

  // ── Mobile nav toggle ──────────────────
  const navToggle = document.getElementById("navToggle");
  const navbar = document.getElementById("navbar");

  if (navToggle && navbar) {
    navToggle.addEventListener("click", function () {
      const isOpen = navbar.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when a link is clicked
    navbar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ── Active nav link on scroll ──────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    var scrollY = window.pageYOffset;

    // Loop through each section and check if it's in view
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var top = rect.top + window.pageYOffset - 140;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          var href = link.getAttribute("href");
          if (href && href === "#" + id) {
            link.classList.add("active");
          } else if (href && href.startsWith("#")) {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // ── Scroll reveal ──────────────────────
  // Only applies the reveal once per element for a clean entrance
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    // Tag elements that should reveal
    var revealTargets = document.querySelectorAll(
      ".tl-item, .project-card, .leadership-card, .tech-group, " +
      ".philosophy-card, .stat-card, .about-text, .mini-project-card"
    );

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Stop observing once revealed
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ── Hero canvas — interactive node network ──
  var canvas = document.getElementById("heroCanvas");

  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var mouse = { x: -999, y: -999 };
    var nodes = [];
    var animFrameId;

    // Node labels representing Ibi's tech domains
    var labels = [
      "Software Engineering",
      "AI",
      "Machine Learning",
      "Data",
      "Computer Vision",
      "Mobile Systems",
      "Backend",
      "Cloud"
    ];

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function initNodes() {
      nodes = [];
      var w = canvas.width;
      var h = canvas.height;

      // Create nodes scattered around the canvas
      for (var i = 0; i < labels.length; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          label: labels[i],
          radius: 3
        });
      }

      // Add some extra unlabeled dots for density
      for (var j = 0; j < 20; j++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          label: "",
          radius: 1.5
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var w = canvas.width;
      var h = canvas.height;
      var accentR = 77;   // --accent rgb components
      var accentG = 141;
      var accentB = 245;

      // Update positions
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges gently
        if (n.x < 0 || n.x > w) { n.vx *= -1; }
        if (n.y < 0 || n.y > h) { n.vy *= -1; }

        // Clamp inside
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        // Subtle cursor repulsion for labeled nodes
        if (n.label) {
          var dx = n.x - mouse.x;
          var dy = n.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            var force = (160 - dist) / 160 * 0.15;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
          // Dampen velocity
          n.vx *= 0.995;
          n.vy *= 0.995;
        }
      }

      // Draw connections between nearby nodes
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var ddx = nodes[a].x - nodes[b].x;
          var ddy = nodes[a].y - nodes[b].y;
          var dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < 180) {
            var alpha = (1 - dd / 180) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = "rgba(" + accentR + "," + accentG + "," + accentB + "," + alpha + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k];
        var glow = 0;

        // Check proximity to mouse for glow
        var mdx = nd.x - mouse.x;
        var mdy = nd.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          glow = (1 - mdist / 150) * 0.5;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.radius + glow * 3, 0, Math.PI * 2);
        ctx.fillStyle = nd.label
          ? "rgba(" + accentR + "," + accentG + "," + accentB + "," + (0.6 + glow * 0.4) + ")"
          : "rgba(255,255,255," + (0.15 + glow * 0.3) + ")";
        ctx.fill();

        // Draw label for labeled nodes
        if (nd.label) {
          ctx.font = "500 11px 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(228,228,238," + (0.35 + glow * 0.5) + ")";
          ctx.fillText(nd.label, nd.x + 8, nd.y + 4);
        }
      }

      animFrameId = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.x = -999;
      mouse.y = -999;
    }

    // Use the hero section for mouse tracking (canvas is pointer-events:none)
    var heroSection = canvas.closest(".hero");
    if (heroSection) {
      heroSection.addEventListener("mousemove", onMouseMove);
      heroSection.addEventListener("mouseleave", onMouseLeave);
    }

    resize();
    initNodes();
    draw();

    window.addEventListener("resize", function () {
      resize();
      initNodes();
    });

    // Pause animation when not visible
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        draw();
      }
    });
  }

  // ── Command Palette (Cmd+K / Ctrl+K) ──
  var cmdOverlay = document.getElementById("cmdOverlay");
  var cmdInput = document.getElementById("cmdInput");
  var cmdListEl = document.getElementById("cmdList");
  var selectedIndex = 0;

  var commands = [
    { icon: "📂", label: "View Projects",    action: function () { window.location.hash = "#projects"; } },
    { icon: "💼", label: "View Experience",   action: function () { window.location.hash = "#experience"; } },
    { icon: "🛠", label: "View Tech Stack",   action: function () { window.location.hash = "#skills"; } },
    { icon: "👤", label: "About Me",          action: function () { window.location.hash = "#about"; } },
    { icon: "🔗", label: "Open GitHub",       action: function () { window.open("https://github.com/ibikhaliq", "_blank"); } },
    { icon: "🔗", label: "Open LinkedIn",     action: function () { window.open("https://www.linkedin.com/in/ibrahim-khaliq-4a8809289/", "_blank"); } },
    { icon: "📄", label: "Download Resume",   action: function () { window.open("Ibrahim_Khaliq_Resume.pdf", "_blank"); } },
    { icon: "✉️", label: "Contact Me",        action: function () { window.location.hash = "#contact"; } }
  ];

  function openPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.hidden = false;
    cmdInput.value = "";
    selectedIndex = 0;
    renderCommands("");
    // Small delay to allow the overlay to render before focusing
    setTimeout(function () { cmdInput.focus(); }, 30);
  }

  function closePalette() {
    if (!cmdOverlay) return;
    cmdOverlay.hidden = true;
  }

  function renderCommands(filter) {
    cmdListEl.innerHTML = "";
    var lower = filter.toLowerCase();

    var filtered = commands.filter(function (cmd) {
      return cmd.label.toLowerCase().indexOf(lower) !== -1;
    });

    // Clamp selected index
    if (selectedIndex >= filtered.length) {
      selectedIndex = Math.max(0, filtered.length - 1);
    }

    for (var i = 0; i < filtered.length; i++) {
      var li = document.createElement("li");
      li.className = "cmd-item" + (i === selectedIndex ? " selected" : "");
      li.setAttribute("role", "option");
      li.innerHTML =
        '<span class="cmd-item-icon">' + filtered[i].icon + "</span>" +
        '<span>' + filtered[i].label + "</span>";

      // Use an IIFE to capture the current command
      (function (cmd) {
        li.addEventListener("click", function () {
          closePalette();
          cmd.action();
        });
      })(filtered[i]);

      cmdListEl.appendChild(li);
    }
  }

  // Keyboard shortcut to open
  document.addEventListener("keydown", function (e) {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.hidden) {
        openPalette();
      } else {
        closePalette();
      }
    }

    // Escape to close
    if (e.key === "Escape" && cmdOverlay && !cmdOverlay.hidden) {
      closePalette();
    }

    // Navigate inside palette
    if (cmdOverlay && !cmdOverlay.hidden) {
      var items = cmdListEl.querySelectorAll(".cmd-item");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        renderCommands(cmdInput.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderCommands(cmdInput.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].click();
        }
      }
    }
  });

  // Filter as user types
  if (cmdInput) {
    cmdInput.addEventListener("input", function () {
      selectedIndex = 0;
      renderCommands(cmdInput.value);
    });
  }

  // Close on overlay background click
  if (cmdOverlay) {
    cmdOverlay.addEventListener("click", function (e) {
      if (e.target === cmdOverlay) {
        closePalette();
      }
    });
  }
})();
