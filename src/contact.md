---
layout: page.njk
title: Contact GearBuddy – Get in Touch
description: Have a question or suggestion for GearBuddy? Send us a message via email or our contact form.
permalink: /contact.html
priority: "0.4"
changefreq: yearly
---

<div class="container page-content">
  <div class="contact-wrapper">

    <header class="page-header">
      <h1>Contact us</h1>
      <p class="page-intro">Have a question, spotted an error, or want to suggest a product? We'd love to hear from you.</p>
    </header>

    <!-- Success Message (shown via JS when ?success=true) -->
    <div class="success-message" id="success-message" role="alert" aria-live="polite">
      <strong>Message sent!</strong> Thanks for reaching out — we'll get back to you as soon as we can.
    </div>

    <!-- Contact Methods -->
    <div class="contact-methods">
      <div class="contact-method">
        <h3>Email</h3>
        <a href="mailto:{{ site.contactEmail }}">{{ site.contactEmail }}</a>
      </div>
      <div class="contact-method">
        <h3>Response time</h3>
        <p>We aim to reply within 2–3 business days.</p>
      </div>
    </div>

    <!-- Web3Forms Contact Form -->
    <form
      action="https://api.web3forms.com/submit"
      method="POST"
      class="contact-form"
      id="contact-form"
      novalidate
    >
      <!-- Web3Forms hidden fields -->
      <input type="hidden" name="access_key" value="REPLACE_WITH_WEB3FORMS_KEY">
      <input type="hidden" name="subject" value="GearBuddy Contact Form">
      <input type="hidden" name="redirect" value="{{ site.url }}/contact.html?success=true">
      <!-- Honeypot spam protection -->
      <input type="checkbox" name="botcheck" class="sr-only" tabindex="-1" aria-hidden="true">

      <div class="form-group">
        <label for="name">Your name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your name"
          autocomplete="name"
        >
      </div>

      <div class="form-group">
        <label for="email">Your email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="you@example.com"
          autocomplete="email"
        >
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          placeholder="Your message..."
        ></textarea>
      </div>

      <div>
        <button type="submit" class="cta-button">Send message</button>
      </div>
    </form>

    <p class="contact-privacy-note">
      Your data is handled according to our <a href="/legal.html#privacy-policy">Privacy Policy</a>. We use Web3Forms to process contact submissions — they do not store your data beyond delivery.
    </p>

  </div>
</div>
