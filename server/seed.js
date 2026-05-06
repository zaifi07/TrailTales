// =====================================================================
// TrailTales — seed script
// Creates two demo users and 8 travel posts.
//
// Usage (from project root):
//   cd server
//   npm run seed
//
// Re-running is safe: existing demo users are reused, but old demo posts
// are wiped and rebuilt so you always get a clean set.
// =====================================================================

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');

const DEMO_USERS = [
  {
    username: 'zaifi',
    name: 'Huzaifa',
    password: '121212',
    bio: 'Nomadic traveller. 36 countries and counting.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70',
  },
  {
    username: 'faizi',
    name: 'Faizan',
    password: '121212',
    bio: 'Mountains, mostly. Sometimes oceans.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70',
  },
];

const POSTS = [
  {
    authorIdx: 0,
    title: 'A week of slow mornings in the Norwegian fjords',
    location: 'Aurland, Norway',
    coverImage:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=70',
    tags: ['norway', 'fjords', 'winter', 'slow-travel'],
    excerpt:
      'Seven days of cabin smoke, dark coffee, and the kind of silence you can almost hear.',
    content: `The first morning I woke up too early. The kind of early where the sky still belongs to the night and the cabin is the only warm thing for miles.

I made coffee on the woodstove because the kettle was somewhere in a box I hadn't unpacked yet. The fjord was a flat sheet of pewter outside the window. A small boat passed and didn't leave a wake.

For the rest of the week I did very little. I read a book about a man who walks across Norway and decided immediately that I would never do that. I cooked food that took hours. I went outside only when the sun was up, which in February is roughly between half ten and three.

What stays with me isn't the views, although they were obviously the point. It's the rhythm. Wake up. Coffee. Sit. Walk. Eat. Read. Sit. Walk. Sleep. Repeat. By Friday I'd forgotten which day was which and that, more than the mountains, was the holiday.`,
  },
  {
    authorIdx: 1,
    title: 'Climbing Mount Bromo before sunrise (and not regretting it)',
    location: 'East Java, Indonesia',
    coverImage:
      'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1600&q=70',
    tags: ['indonesia', 'volcano', 'sunrise', 'hiking'],
    excerpt:
      'A 3am alarm, a freezing jeep ride, and the strangest view I have ever had.',
    content: `Bromo at 3am is cold. Properly cold. The sort of cold that makes you question every decision you've made since landing in Surabaya.

The jeep dropped us off below the viewpoint and we walked the last bit in single file, head torches on, breath visible. It felt less like tourism and more like being on a school trip in space.

Then the sun did its thing. The volcano started to glow from underneath the smoke. The cone of Bromo, the crooked line of Batok, and Semeru in the distance puffing every few minutes — all of it pinking up at the same time.

I'm not normally one for sunrise pilgrimages but this one earned its hype. We spent the morning walking down to the crater rim, ate instant noodles from a small stand at the top, and were back asleep in our hostel by 9.`,
  },
  {
    authorIdx: 0,
    title: 'The Simien Mountains will ruin you for other mountains',
    location: 'Debark, Ethiopia',
    coverImage:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=70',
    tags: ['ethiopia', 'trekking', 'highlands', 'wildlife'],
    excerpt:
      'Cliffs that drop a thousand metres, gelada baboons that don\'t care you exist, and air so thin every step is a small negotiation.',
    content: `Day one of the trek I was convinced I would not finish. The altitude takes things from you that you didn't know were optional — appetite, balance, the ability to find your own jokes funny.

By day three I'd surrendered to it. The pace gets very slow. You stop more often. You notice things. The way the cliff edge folds and folds again like a crumpled bedsheet. The geladas grazing in groups of forty, ignoring you entirely. The smell of woodsmoke from a shepherd's camp three valleys away.

The guide, Ezra, was patient with us in the way you'd be patient with very small children. He stopped to point things out and waited while we caught up. He laughed when we asked dumb questions about plants. He knew, I think, that the mountains were doing the actual teaching.`,
  },
  {
    authorIdx: 1,
    title: 'Aurora-chasing in Iceland on a budget that didn\'t exist',
    location: 'Vík, Iceland',
    coverImage:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=70',
    tags: ['iceland', 'aurora', 'winter', 'roadtrip'],
    excerpt:
      'A second-hand camper, a tank of diesel, and an app that lies about the weather.',
    content: `The camper smelled of someone else's holiday. Old coffee, damp socks, a faint hint of vanilla air freshener fighting a losing war.

We drove the south coast in three days. The plan was to chase clear skies and hope. The reality was a lot of rain, a lot of looking at the aurora forecast app, and one good night.

That one good night was enough. We pulled into a layby outside Vík around 11pm. The clouds had broken up. The first ribbon was so faint I thought I was imagining it. Then it brightened. Then it folded. Then it did that thing where it ripples like a curtain in slow wind.

We stood out there for an hour without speaking. Then we got back in, made instant pasta on the camper's two-burner, and decided the trip was already worth it.`,
  },
  {
    authorIdx: 0,
    title: 'Nine days on the W trek, one missing boot, zero regrets',
    location: 'Torres del Paine, Chile',
    coverImage:
      'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=70',
    tags: ['patagonia', 'chile', 'trekking', 'camping'],
    excerpt:
      'The wind in Patagonia is not a metaphor. It will physically push you sideways.',
    content: `On day two my boot fell apart. Sole gone, completely separated, slapping the ground like a clown shoe. I duct-taped it together at a refugio that night and the tape held for the rest of the trek, which I'm choosing to interpret as a small miracle.

The W trek does what it says on the tin. Three valleys, three big-ticket views, a lot of walking between them. The towers themselves were socked in for our viewpoint morning, which would normally be a tragedy, but they cleared for ten minutes around 9am and we got the photo we'd come for.

What surprised me was the quiet stretches. The bits between the famous things. Walking through old burned forest, the trees standing white and bare like bones. Crossing rivers on suspension bridges that the wind made into trampolines. Eating cold leftover pasta out of a Tupperware while a condor circled overhead, presumably hoping I would die.`,
  },
  {
    authorIdx: 1,
    title: 'Kyoto in winter, when the tourists go home',
    location: 'Kyoto, Japan',
    coverImage:
      'https://images.unsplash.com/photo-1493997181344-712f2f19d87a?auto=format&fit=crop&w=1600&q=70',
    tags: ['japan', 'kyoto', 'winter', 'temples'],
    excerpt:
      'Bare branches, empty shrines, and ramen that costs less than a coffee back home.',
    content: `I went in February on purpose. Kyoto in cherry blossom season is famously beautiful and famously full. February is none of those things and I loved it.

Mornings I'd walk the philosopher's path before sunrise. The canal was iced at the edges. The trees were just dark lines against a sky that hadn't decided what it was doing yet. By the time I got to Ginkaku-ji the gates were just opening and there were maybe four other people inside.

Lunch was always cheap and always good. I had a particular soba place I went back to four times. The owner stopped charging me by the end of the trip — or rather, he charged me less each time, which I think was a joke I wasn't quite getting.

Evenings I'd sit on the wooden steps outside my ryokan and watch the snow do whatever it wanted. There are worse ways to spend a week.`,
  },
  {
    authorIdx: 0,
    title: 'Three nights in the Sahara, no phone signal, no problem',
    location: 'Merzouga, Morocco',
    coverImage:
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=70',
    tags: ['morocco', 'desert', 'sahara', 'camping'],
    excerpt:
      'Camels don\'t like you, the dunes don\'t care about you, the stars carry on without you. It is glorious.',
    content: `The camel I was given was called Bob Marley, which the guide assured me was funny in any language. Bob Marley did not like me. He spent the first hour of the ride trying to bite the camel in front of him and the second hour ignoring me entirely.

The desert sneaks up on you. One minute you're in a town, then a half-paved road, then a track, then nothing. Just dunes. Then more dunes. Your sense of scale gives up — the next ridge is either a hundred metres away or a kilometre and you genuinely cannot tell.

The camp was a circle of low tents around a fire pit. The food was a tagine that had been cooking for a long time over a small flame and tasted like it knew something I didn't. After dinner the guide pulled out a small drum. Nobody asked him to. We sat around the fire and he played until the fire was embers and then we all went and lay on our backs on the sand and looked up at the stars and didn't say much for a long time.`,
  },
  {
    authorIdx: 1,
    title: 'Driving the South Island of New Zealand with bad coffee and a good map',
    location: 'Wanaka, New Zealand',
    coverImage:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=70',
    tags: ['new-zealand', 'roadtrip', 'lakes', 'mountains'],
    excerpt:
      'Two weeks, one rental Toyota, and roughly four thousand sandwiches.',
    content: `The plan was vague. Christchurch to Queenstown via wherever looked interesting. We had a paper map because the rental car's GPS had been removed by someone who I assume was tired of getting lost.

The map turned out to be a feature, not a bug. We took side roads we wouldn't have taken otherwise. We stopped at lakes we couldn't pronounce. We ate sandwiches in laybys overlooking valleys that looked digitally rendered.

The thing about the South Island is that it just keeps going. You think you've seen the best bit, and then you go around a corner, and the next bit is also the best bit. The drive over Lindis Pass into Wanaka, the late light hitting the tussock grass on those rolling hills — that was an hour I won't forget.

We finished the trip in Queenstown, which is busy and loud and has good burgers. After two weeks of empty roads and lake water, the noise was a lot. We left a day early and drove back to Wanaka. Slept in the car by the lake. It was the best night of the trip.`,
  },
];

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Make sure .env is at the project root.');
    }

    await connectDB();

    // Upsert demo users
    const users = [];
    for (const u of DEMO_USERS) {
      let user = await User.findOne({ username: u.username });
      if (!user) {
        user = new User({
          username: u.username,
          name: u.name,
          bio: u.bio,
          avatarUrl: u.avatarUrl,
        });
        await user.setPassword(u.password);
        await user.save();
        console.log(`✓ Created user: ${u.username} (password: ${u.password})`);
      } else {
        console.log(`↺ Reusing existing user: ${u.username}`);
      }
      users.push(user);
    }

    // Wipe old demo posts (only those authored by demo users) and recreate
    const userIds = users.map((u) => u._id);
    const wiped = await Post.deleteMany({ author: { $in: userIds } });
    if (wiped.deletedCount > 0) {
      console.log(`✗ Removed ${wiped.deletedCount} old demo post(s)`);
    }

    let count = 0;
    for (const p of POSTS) {
      const post = new Post({
        title: p.title,
        content: p.content,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        location: p.location,
        tags: p.tags,
        author: users[p.authorIdx]._id,
      });
      // Spread createdAt so the homepage feed has variety
      post.createdAt = new Date(Date.now() - count * 1000 * 60 * 60 * 24);
      await post.save();
      count++;
      console.log(`+ Post: ${p.title}`);
    }

    console.log(`\nDone. Seeded ${users.length} users and ${count} posts.`);
    console.log('Demo logins:');
    for (const u of DEMO_USERS) {
      console.log(`  username: ${u.username}   password: ${u.password}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('\nSeed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
