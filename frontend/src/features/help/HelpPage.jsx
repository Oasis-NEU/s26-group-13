import { useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Divider, Card,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageHeader from '../../components/common/PageHeader';

const SECTIONS = [
  {
    title: 'Searching & Discovering Books',
    body: `Use the search bar at the top of any page to find books by title, author, or keyword. Results appear instantly as you type — click any result to open the book's detail page.

The Home page shows trending books pulled daily from OpenLibrary. Click any book cover to view its full details, description, subjects, and publishing info.`,
  },
  {
    title: 'Adding Books to Your Lists',
    body: `From any book's detail page you'll see three shelf buttons:

• Currently Reading — for books you're actively reading right now.
• Read Later — a wishlist for books you want to get to eventually.
• Finished — for books you've completed.

Click a button to add the book to that shelf. The selected shelf is highlighted in purple with a checkmark. To move a book to a different shelf, just click the other button — it updates instantly.

Books on all shelves appear in your Library page, organized by tab.`,
  },
  {
    title: 'Tracking Reading Progress',
    body: `On your Profile page, your "Currently Reading" shelf shows all books you're actively reading with a progress bar under each cover.

To update your progress, hover over a book and click the pencil (edit) icon. Enter the page you're on and hit Save. The progress bar fills proportionally based on your current page vs the total pages.

If you enter the last page of a book, Chapters automatically moves it to your Finished shelf and congratulates you. You'll have 5 seconds to hit Undo if that was a mistake — the book will be moved back to Currently Reading and your page count will be restored.

Page counts are fetched automatically from OpenLibrary when you load your library. If a book's total pages aren't detected, visit that book's detail page and Chapters will look them up in the background.`,
  },
  {
    title: 'Your Library',
    body: `The Library page organizes all your books across five tabs:

• All — every book across all shelves.
• Reading — books you're currently reading.
• Finished — books you've completed.
• Read Later — your wishlist.
• Favorites — books you've hearted.

Each book card shows its cover, status chip, and reading progress. Click any book to go to its detail page. Use the heart icon on a book card to favorite or unfavorite it without leaving the Library.`,
  },
  {
    title: 'Favorites',
    body: `You can mark any book in your library as a favorite by clicking the heart icon — either on the book card in the Library, or on the book's detail page (the heart icon appears next to the title once the book is on a shelf).

Your top 3 favorites appear on your Profile page in the Favorites column so they're always visible at a glance.`,
  },
  {
    title: 'Reading Activity Chart',
    body: `Your Profile page includes a GitHub-style activity heatmap showing your reading history over the past year. Each square represents one day. The darker the square, the more pages you read that day.

Color scale:
• Light grey — no activity
• Light purple — 1–19 pages
• Medium purple — 20–39 pages
• Dark purple — 40–64 pages
• Deepest purple — 65+ pages

Hover over any square to see the exact date and page count. Activity is recorded automatically whenever you update your page progress or complete a timer session.`,
  },
  {
    title: 'Reading Streak',
    body: `Your current reading streak appears on your Profile page next to a flame icon. A streak counts consecutive days where you logged reading activity — either by updating your page number or completing a timer session.

The streak resets if you miss a day. Keep it going by logging at least some pages every day.`,
  },
  {
    title: 'Reading Timer',
    body: `The Timer page lets you start a focused reading session for a specific book. Select the book from your reading list, set your target duration, and start the timer.

When the session ends, Chapters logs the pages you read that day and updates your activity chart. Active sessions are visible to your followers on the Social page as a live "currently reading" status.`,
  },
  {
    title: 'Social & Following',
    body: `The Social page has three tabs:

• Activity — a live feed of reading sessions from people you follow, plus your own. Shows what book was read and how many pages.
• Following — the list of accounts you follow. Click any username to visit their profile.
• Discover — browse all registered users on Chapters. Click Follow to add someone.

To visit someone's profile, click their username anywhere in the app. You can see their currently reading list, reading stats, activity chart, and favorites.`,
  },
  {
    title: 'Themes',
    body: `Chapters supports three visual themes, switchable from the theme selector in the top navigation bar:

• Nature (default) — warm greens and earthy tones.
• Default — clean purple and white.
• Dark — dark background for night reading.

Your theme preference is saved to your browser and persists across sessions.`,
  },
  {
    title: 'Account & Profile',
    body: `Create an account to sync your library, activity, and follows across devices. Without an account, books you add are stored locally and will be lost if you clear your browser data.

Your Profile page shows:
• Your display name and account stats (books, following, followers, streak)
• Currently Reading shelf with progress bars
• Reading Goal — tracks books finished toward a yearly target of 12
• Quick Stats — total books finished, in progress, pages read
• Favorites — your top 3 hearted books
• Reading Activity — your full year heatmap`,
  },
];

const FAQS = [
  {
    q: 'Why doesn\'t my progress bar fill up?',
    a: 'The progress bar needs to know how many total pages your book has. Chapters fetches this automatically from OpenLibrary when you log in. If it\'s still empty, visit that book\'s detail page — Chapters will look up the page count in the background and it should update within a few seconds.',
  },
  {
    q: 'I accidentally marked a book as finished. How do I fix it?',
    a: 'Immediately after finishing a book, an "UNDO" button appears in the notification at the bottom of the screen. You have 5 seconds to click it. If you missed it, go to the book\'s detail page and click "Currently Reading" to move it back.',
  },
  {
    q: 'Will my data be lost if I log out?',
    a: 'No. Your library, progress, favorites, and activity are all saved to your account in the cloud. Logging back in on any device will restore everything.',
  },
  {
    q: 'Can I use Chapters without creating an account?',
    a: 'Yes, but your data is only stored locally in your browser. If you clear your cache or switch devices, it will be gone. Creating a free account keeps everything synced and safe.',
  },
  {
    q: 'How is my reading streak calculated?',
    a: 'A streak counts consecutive days with at least one reading activity logged — either updating your page number or finishing a timer session. If today has no activity yet, the streak still counts if yesterday had activity (it gives you until the end of the day). Missing a full day resets the streak to 0.',
  },
  {
    q: 'Why does the book cover not show up?',
    a: 'Cover images come from OpenLibrary. Some books don\'t have covers uploaded there. In that case Chapters shows a placeholder with the first letter of the book\'s title.',
  },
  {
    q: 'Can I add a book that isn\'t showing up in search?',
    a: 'Chapters searches OpenLibrary, which has millions of titles. If a book isn\'t showing, try searching by ISBN, or a different form of the title. Very new releases or obscure titles may not be indexed yet.',
  },
  {
    q: 'How do I remove a book from my library entirely?',
    a: 'On your Profile page, hover over any book in the Currently Reading section and click the red trash icon. This removes it from all your shelves permanently.',
  },
  {
    q: 'What\'s the difference between "Read Later" and "Currently Reading"?',
    a: '"Currently Reading" is for books you\'re actively reading right now — they show up on your Profile with progress bars. "Read Later" is a wishlist for books you intend to read someday but haven\'t started. Only Currently Reading books appear on your main Profile.',
  },
  {
    q: 'Does Chapters work on mobile?',
    a: 'The app is designed as a web app and works in any browser including mobile browsers. For the best experience on small screens, use your browser\'s "Add to Home Screen" option to install it like an app.',
  },
];

export default function HelpPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <PageHeader title="Help & FAQ" subtitle="Everything you need to know about Chapters" />

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>How It Works</Typography>
      <Card sx={{ p: 3, mb: 4 }}>
        {SECTIONS.map((section, i) => (
          <Box key={section.title}>
            {i > 0 && <Divider sx={{ my: 3 }} />}
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {section.body}
            </Typography>
          </Box>
        ))}
      </Card>

      <Typography variant="h6" gutterBottom>Frequently Asked Questions</Typography>
      <Box sx={{ mb: 4 }}>
        {FAQS.map((faq) => (
          <Accordion
            key={faq.q}
            expanded={expanded === faq.q}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? faq.q : false)}
            disableGutters
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" fontWeight={600}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </div>
  );
}
