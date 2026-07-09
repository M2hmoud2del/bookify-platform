import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, PublicNavbarComponent, FooterComponent],
  template: `
    <app-public-navbar></app-public-navbar>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-badge">
            <span class="material-icons-outlined">auto_awesome</span>
            Trusted by 10,000+ businesses
          </span>
          <h1 class="hero-title">
            Smart Appointment
            <span class="hero-highlight">Scheduling</span>
            for Modern Businesses
          </h1>
          <p class="hero-description">
            Manage appointments, customers, and payments all in one place.
            Bookify helps you save time, reduce no-shows, and grow your business.
          </p>
          <div class="hero-actions">
            <app-button variant="primary" size="lg" routerLink="/register">
              Get Started Free
            </app-button>
            <app-button variant="outline" size="lg" routerLink="/#demo">
              <span class="material-icons-outlined">play_circle</span>
              Watch Demo
            </app-button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="stat-value">10K+</span>
              <span class="stat-label">Active Users</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">500K+</span>
              <span class="stat-label">Appointments</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">4.9</span>
              <span class="stat-label">User Rating</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img
            src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Dashboard preview"
            class="dashboard-mockup"
          />
        </div>
      </div>
      <div class="hero-gradient"></div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Features</span>
          <h2 class="section-title">Everything you need to run your business</h2>
          <p class="section-description">
            Powerful tools designed to streamline your appointment workflow and enhance customer experience.
          </p>
        </div>

        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-card">
              <div class="feature-icon" [style.background]="feature.color">
                <span class="material-icons-outlined">{{ feature.icon }}</span>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works" id="how-it-works">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">How It Works</span>
          <h2 class="section-title">Get started in minutes</h2>
          <p class="section-description">
            Set up your booking system in three simple steps and start accepting appointments today.
          </p>
        </div>

        <div class="steps-grid">
          @for (step of steps; track step.number) {
            <div class="step-card">
              <span class="step-number">{{ step.number }}</span>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials" id="testimonials">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Testimonials</span>
          <h2 class="section-title">Loved by businesses worldwide</h2>
          <p class="section-description">
            See how Bookify has transformed appointment management for businesses just like yours.
          </p>
        </div>

        <div class="testimonials-grid">
          @for (testimonial of testimonials; track testimonial.name) {
            <div class="testimonial-card">
              <div class="testimonial-rating">
                @for (star of [1,2,3,4,5]; track star) {
                  <span class="material-icons-outlined star-icon">star</span>
                }
              </div>
              <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
              <div class="testimonial-author">
                <img [src]="testimonial.avatar" [alt]="testimonial.name" class="author-avatar" />
                <div class="author-info">
                  <p class="author-name">{{ testimonial.name }}</p>
                  <p class="author-role">{{ testimonial.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing" id="pricing">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Pricing</span>
          <h2 class="section-title">Simple, transparent pricing</h2>
          <p class="section-description">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div class="pricing-grid">
          @for (plan of pricingPlans; track plan.name) {
            <div class="pricing-card" [ngClass]="{ 'is-popular': plan.popular }">
              @if (plan.popular) {
                <span class="popular-badge">Most Popular</span>
              }
              <h3 class="plan-name">{{ plan.name }}</h3>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period">/month</span>
              </div>
              <p class="plan-description">{{ plan.description }}</p>
              <ul class="plan-features">
                @for (feature of plan.features; track feature) {
                  <li class="feature-item">
                    <span class="material-icons-outlined">check_circle</span>
                    <span>{{ feature }}</span>
                  </li>
                }
              </ul>
              <app-button
                [variant]="plan.popular ? 'primary' : 'outline'"
                [fullWidth]="true"
                routerLink="/register"
              >
                {{ plan.price === 0 ? 'Get Started' : 'Start Free Trial' }}
              </app-button>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq" id="faq">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">FAQ</span>
          <h2 class="section-title">Frequently asked questions</h2>
        </div>

        <div class="faq-list">
          @for (item of faqItems; track item.question) {
            <div class="faq-item" (click)="toggleFaq(item.question)">
              <div class="faq-question">
                <span>{{ item.question }}</span>
                <span class="material-icons-outlined">
                  {{ openFaq() === item.question ? 'expand_less' : 'expand_more' }}
                </span>
              </div>
              @if (openFaq() === item.question) {
                <p class="faq-answer">{{ item.answer }}</p>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to transform your business?</h2>
          <p class="cta-description">
            Join thousands of businesses already using Bookify to manage appointments efficiently.
          </p>
          <div class="cta-actions">
            <app-button variant="primary" size="lg" routerLink="/register">
              Get Started Free
            </app-button>
            <app-button variant="outline" size="lg">
              Contact Sales
            </app-button>
          </div>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: 0 var(--space-4);
    }

    /* Hero Section */
    .hero {
      position: relative;
      padding: calc(var(--navbar-height) + var(--space-16)) 0 var(--space-16);
      overflow: hidden;
      background: linear-gradient(180deg, var(--gray-50) 0%, var(--background) 100%);
    }

    :host-context(.dark) .hero {
      background: linear-gradient(180deg, var(--gray-900) 0%, var(--background) 100%);
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-12);
      align-items: center;
    }

    @media (min-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr 1fr;
      }
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      background: var(--primary-100);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-6);
    }

    :host-context(.dark) .hero-badge {
      color: var(--primary-400);
      background: rgba(79, 70, 229, 0.2);
    }

    .hero-badge .material-icons-outlined {
      font-size: 1rem;
    }

    .hero-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      color: var(--text-primary);
      margin: 0 0 var(--space-6);
    }

    @media (min-width: 768px) {
      .hero-title {
        font-size: var(--font-size-5xl);
      }
    }

    @media (min-width: 1024px) {
      .hero-title {
        font-size: var(--font-size-6xl);
      }
    }

    .hero-highlight {
      position: relative;
      color: var(--primary-500);
    }

    .hero-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      line-height: var(--line-height-relaxed);
      margin: 0 0 var(--space-8);
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin-bottom: var(--space-8);
    }

    .hero-stats {
      display: flex;
      gap: var(--space-8);
    }

    .hero-stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .hero-image {
      position: relative;
    }

    .dashboard-mockup {
      width: 100%;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
    }

    /* Section Styles */
    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto var(--space-12);
    }

    .section-badge {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      background: var(--primary-100);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-4);
    }

    :host-context(.dark) .section-badge {
      color: var(--primary-400);
      background: rgba(79, 70, 229, 0.2);
    }

    .section-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }

    .section-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin: 0;
    }

    /* Features Section */
    .features {
      padding: var(--space-20) 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-6);
    }

    @media (min-width: 640px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .feature-card {
      padding: var(--space-6);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      transition: all var(--transition-normal);
    }

    :host-context(.dark) .feature-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .feature-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }

    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      color: white;
      margin-bottom: var(--space-4);
    }

    .feature-icon .material-icons-outlined {
      font-size: 1.5rem;
    }

    .feature-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    .feature-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    /* How It Works Section */
    .how-it-works {
      padding: var(--space-20) 0;
      background: var(--gray-50);
    }

    :host-context(.dark) .how-it-works {
      background: var(--gray-900);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-8);
    }

    @media (min-width: 768px) {
      .steps-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .step-card {
      position: relative;
      text-align: center;
      padding: var(--space-6);
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
      background: var(--primary-100);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-4);
    }

    :host-context(.dark) .step-number {
      background: rgba(79, 70, 229, 0.2);
    }

    .step-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    .step-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    /* Testimonials Section */
    .testimonials {
      padding: var(--space-20) 0;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    @media (min-width: 768px) {
      .testimonials-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .testimonials-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .testimonial-card {
      padding: var(--space-6);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .testimonial-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .testimonial-rating {
      display: flex;
      gap: 0.125rem;
      margin-bottom: var(--space-4);
    }

    .star-icon {
      color: var(--warning-500);
      font-size: 1.125rem;
    }

    .testimonial-quote {
      font-size: var(--font-size-base);
      color: var(--text-primary);
      margin: 0 0 var(--space-6);
      line-height: var(--line-height-relaxed);
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      object-fit: cover;
    }

    .author-info {
      flex: 1;
    }

    .author-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .author-role {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    /* Pricing Section */
    .pricing {
      padding: var(--space-20) 0;
      background: var(--gray-50);
    }

    :host-context(.dark) .pricing {
      background: var(--gray-900);
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-6);
      max-width: 1000px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .pricing-grid {
        grid-template-columns: repeat(3, 1fr);
        align-items: start;
      }
    }

    .pricing-card {
      position: relative;
      padding: var(--space-8);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      text-align: center;
    }

    :host-context(.dark) .pricing-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .pricing-card.is-popular {
      border-color: var(--primary-500);
      box-shadow: var(--shadow-xl);
    }

    @media (min-width: 768px) {
      .pricing-card.is-popular {
        transform: translateY(-16px);
      }
    }

    .popular-badge {
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      padding: var(--space-1) var(--space-3);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: white;
      background: var(--primary-500);
      border-radius: var(--radius-full);
    }

    .plan-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.125rem;
      margin-bottom: var(--space-2);
    }

    .currency {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .amount {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .period {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .plan-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-6);
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-6);
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) 0;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .feature-item .material-icons-outlined {
      color: var(--success-500);
      font-size: 1.125rem;
    }

    /* FAQ Section */
    .faq {
      padding: var(--space-20) 0;
    }

    .faq-list {
      max-width: 700px;
      margin: 0 auto;
    }

    .faq-item {
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .faq-item {
      border-color: var(--gray-700);
    }

    .faq-question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-5) 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      cursor: pointer;
    }

    .faq-question .material-icons-outlined {
      color: var(--text-secondary);
    }

    .faq-answer {
      padding-bottom: var(--space-5);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    /* CTA Section */
    .cta {
      padding: var(--space-20) 0;
      background: var(--primary-600);
    }

    .cta-content {
      text-align: center;
    }

    .cta-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-4);
    }

    .cta-description {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 var(--space-8);
    }

    .cta-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-4);
    }
  `],
})
export class LandingComponent {
  authService = inject(AuthService);
  openFaq = signal<string | null>(null);

  features = [
    {
      icon: 'event',
      title: 'Online Booking',
      description: 'Let customers book appointments 24/7 through your personalized booking page.',
      color: 'var(--primary-500)',
    },
    {
      icon: 'notifications',
      title: 'Automated Reminders',
      description: 'Reduce no-shows with automated email and SMS reminders.',
      color: 'var(--accent-500)',
    },
    {
      icon: 'payments',
      title: 'Payment Processing',
      description: 'Accept payments online with integrated Stripe payment processing.',
      color: 'var(--success-500)',
    },
    {
      icon: 'calendar_today',
      title: 'Calendar Sync',
      description: 'Sync with Google Calendar, Apple Calendar, and other popular calendars.',
      color: 'var(--warning-500)',
    },
    {
      icon: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Track performance with detailed reports on bookings, revenue, and customers.',
      color: 'var(--danger-500)',
    },
    {
      icon: 'people',
      title: 'Customer Management',
      description: 'Manage customer profiles, history, and preferences in one place.',
      color: 'var(--primary-500)',
    },
  ];

  steps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Set up your business profile, services, and availability in minutes.',
    },
    {
      number: '2',
      title: 'Share Your Link',
      description: 'Share your unique booking page with clients or embed it on your website.',
    },
    {
      number: '3',
      title: 'Start Booking',
      description: 'Accept appointments and let Bookify handle scheduling, reminders, and payments.',
    },
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Owner, Blossom Beauty Salon',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Bookify has transformed how I manage my salon. I\'ve reduced no-shows by 40% and my clients love the easy booking experience.',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Family Doctor',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The automated reminders and calendar sync have made appointment management effortless. I can focus more on patient care.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Freelance Photographer',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'As a freelancer, Bookify helps me look professional. Clients can book sessions directly and I get paid automatically.',
    },
  ];

  pricingPlans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for getting started',
      features: ['Up to 50 appointments/month', 'Basic booking page', 'Email reminders', '1 team member'],
      popular: false,
    },
    {
      name: 'Professional',
      price: 29,
      description: 'For growing businesses',
      features: ['Unlimited appointments', 'Custom booking page', 'SMS & email reminders', 'Up to 5 team members', 'Payment processing', 'Analytics dashboard'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      description: 'For large organizations',
      features: ['Everything in Professional', 'Unlimited team members', 'Custom branding', 'API access', 'Priority support', 'Advanced integrations'],
      popular: false,
    },
  ];

  faqItems = [
    {
      question: 'How does the free trial work?',
      answer: 'Our 14-day free trial gives you full access to all Professional plan features. No credit card required. Cancel anytime.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can pay by invoice.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption and your data is stored securely in SOC 2 certified data centers.',
    },
    {
      question: 'Can I export my customer data?',
      answer: 'Yes, you can export all your data including customers, appointments, and payment history at any time.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
    },
  ];

  toggleFaq(question: string): void {
    this.openFaq.update((current: string | null) => (current === question ? null : question));
  }
}
