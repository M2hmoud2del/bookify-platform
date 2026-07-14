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
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
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
