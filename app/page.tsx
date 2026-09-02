'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Settings2Icon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBaby,
  faBell,
  faBook,
  faBookOpen,
  faBriefcase,
  faBroom,
  faBullseye,
  faBuilding,
  faCakeCandles,
  faCalendarDays,
  faCamera,
  faCar,
  faCartShopping,
  faCat,
  faChartLine,
  faCheckDouble,
  faChurch,
  faClapperboard,
  faClipboardCheck,
  faClock,
  faCode,
  faComments,
  faCompactDisc,
  faDog,
  faDrum,
  faDumbbell,
  faEnvelope,
  faFileLines,
  faFilm,
  faFlagCheckered,
  faFolder,
  faGamepad,
  faGavel,
  faGift,
  faGlobe,
  faGraduationCap,
  faGuitar,
  faHeadphones,
  faHandshake,
  faHeartPulse,
  faHouse,
  faInbox,
  faLaptop,
  faLeaf,
  faLightbulb,
  faListCheck,
  faMapLocationDot,
  faMicrophoneLines,
  faMoneyBill,
  faMusic,
  faPalette,
  faPen,
  faPersonRunning,
  faPhone,
  faPills,
  faPiggyBank,
  faPlane,
  faPodcast,
  faRadio,
  faRecordVinyl,
  faRing,
  faScaleBalanced,
  faSeedling,
  faShieldHeart,
  faStethoscope,
  faTags,
  faTrophy,
  faUsers,
  faUserGroup,
  faUtensils,
  faVolumeHigh,
  faWallet,
  faWandMagicSparkles,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import {
  ArchiveIcon,
  BranchIcon,
  CalendarIcon,
  CheckIcon,
  GlassPanel,
  IconButton,
  ListIcon,
  MoreIcon,
  PlusIcon,
  QuickAddBar,
  TimelineIcon,
  TodoStyleGuide,
  TrashIcon,
  type QuickAddValue,
} from '@/components/StyleGuide';
import {
  deriveTaskCompletion,
  formatWorkDone,
  recordWork,
  taskRepository,
  type ProgressUnit,
  type Subtask,
  type Task,
  type WorkLogEntry,
} from '@/lib/task-repository';
import {
  formatDeadlineResolution,
  parseHumanDeadline,
} from '@/lib/human-deadline';
import {
  DEFAULT_DAY_END_TIME,
  dueInstant,
  formatClockTime,
  getDayKey,
  normalizeDayEndTime,
  toDateKey,
} from '@/lib/day-boundary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignOutButton } from '@/components/SignOutButton';

type View =
  | 'tasks'
  | 'timeline'
  | 'shelf'
  | 'habits'
  | 'projects'
  | 'style-guide';
type Theme = 'dark' | 'light';

type CategoryMeta = { icon: string; label: string };
type CategoryIconOption = {
  id: string;
  name: string;
  keywords: string[];
  icon?: IconDefinition;
  emoji?: string;
};

const categoryIconOptions: CategoryIconOption[] = [
  {
    id: 'tags',
    name: 'Tags',
    icon: faTags,
    keywords: ['tag', 'general', 'other'],
  },
  {
    id: 'folder',
    name: 'Folder',
    icon: faFolder,
    keywords: ['files', 'organize', 'project'],
  },
  {
    id: 'briefcase',
    name: 'Work',
    icon: faBriefcase,
    keywords: ['work', 'office', 'career', 'business'],
  },
  {
    id: 'book',
    name: 'Study',
    icon: faBookOpen,
    keywords: ['study', 'school', 'learn', 'reading', 'course'],
  },
  {
    id: 'house',
    name: 'Home',
    icon: faHouse,
    keywords: ['home', 'house', 'family', 'chores'],
  },
  {
    id: 'heart',
    name: 'Health',
    icon: faHeartPulse,
    keywords: ['health', 'wellness', 'medical', 'care'],
  },
  {
    id: 'dumbbell',
    name: 'Fitness',
    icon: faDumbbell,
    keywords: ['fitness', 'exercise', 'gym', 'workout'],
  },
  {
    id: 'cart',
    name: 'Shopping',
    icon: faCartShopping,
    keywords: ['shop', 'shopping', 'groceries', 'buy'],
  },
  {
    id: 'plane',
    name: 'Travel',
    icon: faPlane,
    keywords: ['travel', 'trip', 'vacation', 'flight'],
  },
  {
    id: 'lightbulb',
    name: 'Ideas',
    icon: faLightbulb,
    keywords: ['idea', 'brainstorm', 'think'],
  },
  {
    id: 'bullseye',
    name: 'Goals',
    icon: faBullseye,
    keywords: ['goal', 'target', 'plan', 'focus'],
  },
  {
    id: 'palette',
    name: 'Creative',
    icon: faPalette,
    keywords: ['creative', 'design', 'art', 'hobby'],
  },
  {
    id: 'comments',
    name: 'People',
    icon: faComments,
    keywords: ['people', 'social', 'chat', 'voice'],
  },
  {
    id: 'users',
    name: 'Team',
    icon: faUserGroup,
    keywords: ['team', 'group', 'collaboration'],
  },
  {
    id: 'file',
    name: 'Notes',
    icon: faFileLines,
    keywords: ['notes', 'note', 'write', 'document'],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: faCalendarDays,
    keywords: ['calendar', 'schedule', 'date', 'event', 'planning', 'goals'],
  },
  {
    id: 'chart',
    name: 'Progress',
    icon: faChartLine,
    keywords: ['progress', 'growth', 'metric', 'analytics', 'track', 'goals'],
  },
  {
    id: 'trophy',
    name: 'Achievement',
    icon: faTrophy,
    keywords: ['goal', 'goals', 'win', 'achievement', 'milestone'],
  },
  {
    id: 'flag',
    name: 'Milestone',
    icon: faFlagCheckered,
    keywords: ['goal', 'goals', 'finish', 'milestone', 'target'],
  },
  {
    id: 'checklist',
    name: 'Checklist',
    icon: faListCheck,
    keywords: ['task', 'tasks', 'todo', 'to-do', 'checklist', 'goals'],
  },
  {
    id: 'check-double',
    name: 'Complete',
    icon: faCheckDouble,
    keywords: ['done', 'complete', 'finish', 'success', 'goals'],
  },
  {
    id: 'pen',
    name: 'Writing',
    icon: faPen,
    keywords: ['write', 'writing', 'journal', 'draft'],
  },
  {
    id: 'wand',
    name: 'Personal',
    icon: faWandMagicSparkles,
    keywords: ['personal', 'routine', 'self', 'magic'],
  },
  {
    id: 'camera',
    name: 'Photography',
    icon: faCamera,
    keywords: ['photo', 'photography', 'camera', 'pictures'],
  },
  {
    id: 'music',
    name: 'Music',
    icon: faMusic,
    keywords: ['music', 'song', 'audio', 'listen', 'sound'],
  },
  {
    id: 'guitar',
    name: 'Guitar',
    icon: faGuitar,
    keywords: ['music', 'instrument', 'guitar', 'band', 'practice'],
  },
  {
    id: 'headphones',
    name: 'Headphones',
    icon: faHeadphones,
    keywords: ['music', 'audio', 'listen', 'podcast', 'sound'],
  },
  {
    id: 'record',
    name: 'Record',
    icon: faRecordVinyl,
    keywords: ['music', 'record', 'album', 'vinyl', 'playlist'],
  },
  {
    id: 'disc',
    name: 'Album',
    icon: faCompactDisc,
    keywords: ['music', 'album', 'record', 'audio'],
  },
  {
    id: 'microphone',
    name: 'Microphone',
    icon: faMicrophoneLines,
    keywords: ['music', 'sing', 'singing', 'voice', 'podcast', 'recording'],
  },
  {
    id: 'drum',
    name: 'Drums',
    icon: faDrum,
    keywords: ['music', 'drums', 'instrument', 'band', 'rhythm'],
  },
  {
    id: 'radio',
    name: 'Radio',
    icon: faRadio,
    keywords: ['music', 'radio', 'broadcast', 'audio'],
  },
  {
    id: 'podcast',
    name: 'Podcast',
    icon: faPodcast,
    keywords: ['music', 'podcast', 'audio', 'listen', 'recording'],
  },
  {
    id: 'volume',
    name: 'Sound',
    icon: faVolumeHigh,
    keywords: ['music', 'sound', 'audio', 'volume'],
  },
  {
    id: 'film',
    name: 'Movies',
    icon: faFilm,
    keywords: ['movie', 'movies', 'film', 'watch', 'video'],
  },
  {
    id: 'clapperboard',
    name: 'Video',
    icon: faClapperboard,
    keywords: ['movie', 'movies', 'film', 'video', 'editing'],
  },
  {
    id: 'gamepad',
    name: 'Games',
    icon: faGamepad,
    keywords: ['game', 'games', 'gaming', 'play'],
  },
  {
    id: 'utensils',
    name: 'Food',
    icon: faUtensils,
    keywords: ['food', 'meal', 'cook', 'cooking', 'recipe'],
  },
  {
    id: 'car',
    name: 'Errands',
    icon: faCar,
    keywords: ['errand', 'errands', 'car', 'drive', 'transport'],
  },
  {
    id: 'wallet',
    name: 'Finance',
    icon: faWallet,
    keywords: ['finance', 'money', 'budget', 'wallet'],
  },
  {
    id: 'money',
    name: 'Payments',
    icon: faMoneyBill,
    keywords: ['payment', 'payments', 'bills', 'money'],
  },
  {
    id: 'piggy-bank',
    name: 'Savings',
    icon: faPiggyBank,
    keywords: ['saving', 'savings', 'money', 'finance'],
  },
  {
    id: 'laptop',
    name: 'Computer',
    icon: faLaptop,
    keywords: ['computer', 'laptop', 'digital', 'online'],
  },
  {
    id: 'code',
    name: 'Code',
    icon: faCode,
    keywords: ['code', 'coding', 'development', 'programming'],
  },
  {
    id: 'wrench',
    name: 'Maintenance',
    icon: faWrench,
    keywords: ['maintenance', 'fix', 'repair', 'tools'],
  },
  {
    id: 'broom',
    name: 'Cleaning',
    icon: faBroom,
    keywords: ['clean', 'cleaning', 'chores', 'housework'],
  },
  {
    id: 'dog',
    name: 'Dog',
    icon: faDog,
    keywords: ['dog', 'pet', 'pets', 'animal'],
  },
  {
    id: 'cat',
    name: 'Cat',
    icon: faCat,
    keywords: ['cat', 'pet', 'pets', 'animal'],
  },
  {
    id: 'seedling',
    name: 'Garden',
    icon: faSeedling,
    keywords: ['garden', 'plant', 'plants', 'grow'],
  },
  {
    id: 'leaf',
    name: 'Nature',
    icon: faLeaf,
    keywords: ['nature', 'outdoors', 'environment', 'eco'],
  },
  {
    id: 'bell',
    name: 'Reminder',
    icon: faBell,
    keywords: ['reminder', 'reminders', 'alert', 'notify'],
  },
  {
    id: 'clock',
    name: 'Time',
    icon: faClock,
    keywords: ['time', 'clock', 'deadline', 'schedule'],
  },
  {
    id: 'inbox',
    name: 'Inbox',
    icon: faInbox,
    keywords: ['inbox', 'email', 'admin', 'incoming'],
  },
  {
    id: 'graduation',
    name: 'Education',
    icon: faGraduationCap,
    keywords: ['education', 'university', 'college', 'graduate'],
  },
  {
    id: 'book-solid',
    name: 'Reading',
    icon: faBook,
    keywords: ['read', 'reading', 'book', 'books'],
  },
  {
    id: 'globe',
    name: 'Language',
    icon: faGlobe,
    keywords: ['language', 'languages', 'world', 'international'],
  },
  {
    id: 'map',
    name: 'Places',
    icon: faMapLocationDot,
    keywords: ['place', 'places', 'map', 'location'],
  },
  {
    id: 'running',
    name: 'Running',
    icon: faPersonRunning,
    keywords: ['run', 'running', 'race', 'exercise'],
  },
  {
    id: 'stethoscope',
    name: 'Medical',
    icon: faStethoscope,
    keywords: ['medical', 'doctor', 'appointment', 'health'],
  },
  {
    id: 'pills',
    name: 'Medication',
    icon: faPills,
    keywords: ['medication', 'medicine', 'pills', 'health'],
  },
  {
    id: 'baby',
    name: 'Family',
    icon: faBaby,
    keywords: ['baby', 'child', 'children', 'family'],
  },
  {
    id: 'ring',
    name: 'Relationship',
    icon: faRing,
    keywords: ['relationship', 'wedding', 'marriage', 'partner'],
  },
  {
    id: 'gift',
    name: 'Gifts',
    icon: faGift,
    keywords: ['gift', 'gifts', 'birthday', 'present'],
  },
  {
    id: 'cake',
    name: 'Celebration',
    icon: faCakeCandles,
    keywords: ['birthday', 'celebration', 'party', 'event'],
  },
  {
    id: 'church',
    name: 'Faith',
    icon: faChurch,
    keywords: ['faith', 'church', 'religion', 'spiritual'],
  },
  {
    id: 'handshake',
    name: 'Networking',
    icon: faHandshake,
    keywords: ['networking', 'client', 'meeting', 'relationship'],
  },
  {
    id: 'building',
    name: 'Business',
    icon: faBuilding,
    keywords: ['business', 'company', 'office', 'work'],
  },
  {
    id: 'users-solid',
    name: 'Community',
    icon: faUsers,
    keywords: ['community', 'people', 'group', 'social'],
  },
  {
    id: 'phone',
    name: 'Calls',
    icon: faPhone,
    keywords: ['call', 'calls', 'phone', 'voice'],
  },
  {
    id: 'envelope',
    name: 'Email',
    icon: faEnvelope,
    keywords: ['email', 'mail', 'message', 'inbox'],
  },
  {
    id: 'clipboard',
    name: 'Admin',
    icon: faClipboardCheck,
    keywords: ['admin', 'paperwork', 'forms', 'organize'],
  },
  {
    id: 'scale',
    name: 'Legal',
    icon: faScaleBalanced,
    keywords: ['legal', 'law', 'contract', 'tax'],
  },
  {
    id: 'gavel',
    name: 'Important',
    icon: faGavel,
    keywords: ['important', 'legal', 'decision', 'priority'],
  },
  {
    id: 'shield',
    name: 'Care',
    icon: faShieldHeart,
    keywords: ['care', 'safety', 'insurance', 'health'],
  },
  {
    id: 'emoji-sparkles',
    name: 'Sparkles',
    emoji: '✨',
    keywords: ['sparkles', 'magic', 'special', 'favorite', 'stars'],
  },
  {
    id: 'emoji-star',
    name: 'Star',
    emoji: '⭐',
    keywords: ['star', 'favorite', 'important', 'rating'],
  },
  {
    id: 'emoji-fire',
    name: 'Fire',
    emoji: '🔥',
    keywords: ['fire', 'hot', 'energy', 'streak', 'trending'],
  },
  {
    id: 'emoji-heart',
    name: 'Heart',
    emoji: '❤️',
    keywords: ['heart', 'love', 'favorite', 'care', 'relationship'],
  },
  {
    id: 'emoji-sun',
    name: 'Sun',
    emoji: '☀️',
    keywords: ['sun', 'morning', 'bright', 'summer', 'weather'],
  },
  {
    id: 'emoji-moon',
    name: 'Moon',
    emoji: '🌙',
    keywords: ['moon', 'night', 'evening', 'sleep'],
  },
  {
    id: 'emoji-rainbow',
    name: 'Rainbow',
    emoji: '🌈',
    keywords: ['rainbow', 'pride', 'color', 'colors', 'weather'],
  },
  {
    id: 'emoji-cloud',
    name: 'Cloud',
    emoji: '☁️',
    keywords: ['cloud', 'weather', 'sky', 'dream'],
  },
  {
    id: 'emoji-snowflake',
    name: 'Snowflake',
    emoji: '❄️',
    keywords: ['snow', 'snowflake', 'winter', 'cold', 'weather'],
  },
  {
    id: 'emoji-plant',
    name: 'Plant',
    emoji: '🪴',
    keywords: ['plant', 'home', 'garden', 'grow', 'nature'],
  },
  {
    id: 'emoji-four-leaf-clover',
    name: 'Lucky Clover',
    emoji: '🍀',
    keywords: ['luck', 'lucky', 'clover', 'green', 'nature'],
  },
  {
    id: 'emoji-coffee',
    name: 'Coffee',
    emoji: '☕',
    keywords: ['coffee', 'tea', 'drink', 'breakfast', 'morning'],
  },
  {
    id: 'emoji-pizza',
    name: 'Pizza',
    emoji: '🍕',
    keywords: ['pizza', 'food', 'meal', 'party'],
  },
  {
    id: 'emoji-apple',
    name: 'Apple',
    emoji: '🍎',
    keywords: ['apple', 'fruit', 'food', 'health', 'school'],
  },
  {
    id: 'emoji-cake',
    name: 'Cake',
    emoji: '🎂',
    keywords: ['cake', 'birthday', 'celebration', 'party'],
  },
  {
    id: 'emoji-gift',
    name: 'Gift',
    emoji: '🎁',
    keywords: ['gift', 'present', 'birthday', 'celebration'],
  },
  {
    id: 'emoji-balloon',
    name: 'Balloon',
    emoji: '🎈',
    keywords: ['balloon', 'party', 'celebration', 'birthday'],
  },
  {
    id: 'emoji-check',
    name: 'Check Mark',
    emoji: '✅',
    keywords: ['check', 'done', 'complete', 'success', 'task'],
  },
  {
    id: 'emoji-target',
    name: 'Target',
    emoji: '🎯',
    keywords: ['target', 'goal', 'focus', 'bullseye', 'achievement'],
  },
  {
    id: 'emoji-calendar',
    name: 'Calendar',
    emoji: '📅',
    keywords: ['calendar', 'schedule', 'date', 'event', 'planning'],
  },
  {
    id: 'emoji-alarm',
    name: 'Alarm Clock',
    emoji: '⏰',
    keywords: ['alarm', 'clock', 'time', 'reminder', 'deadline'],
  },
  {
    id: 'emoji-laptop',
    name: 'Laptop',
    emoji: '💻',
    keywords: ['laptop', 'computer', 'work', 'code', 'online'],
  },
  {
    id: 'emoji-phone',
    name: 'Phone',
    emoji: '📱',
    keywords: ['phone', 'mobile', 'call', 'message', 'device'],
  },
  {
    id: 'emoji-email',
    name: 'Email',
    emoji: '📧',
    keywords: ['email', 'mail', 'message', 'inbox', 'communication'],
  },
  {
    id: 'emoji-camera',
    name: 'Camera',
    emoji: '📸',
    keywords: ['camera', 'photo', 'photography', 'picture', 'creative'],
  },
  {
    id: 'emoji-books',
    name: 'Books',
    emoji: '📚',
    keywords: ['books', 'book', 'reading', 'study', 'school', 'learning'],
  },
  {
    id: 'emoji-pencil',
    name: 'Pencil',
    emoji: '✏️',
    keywords: ['pencil', 'write', 'writing', 'school', 'notes'],
  },
  {
    id: 'emoji-money',
    name: 'Money',
    emoji: '💰',
    keywords: ['money', 'finance', 'savings', 'budget', 'wealth'],
  },
  {
    id: 'emoji-gem',
    name: 'Gem',
    emoji: '💎',
    keywords: ['gem', 'diamond', 'valuable', 'favorite', 'achievement'],
  },
  {
    id: 'emoji-muscle',
    name: 'Strength',
    emoji: '💪',
    keywords: ['strength', 'strong', 'fitness', 'exercise', 'workout'],
  },
  {
    id: 'emoji-running',
    name: 'Runner',
    emoji: '🏃',
    keywords: ['run', 'running', 'fitness', 'exercise', 'race'],
  },
  {
    id: 'emoji-party',
    name: 'Party',
    emoji: '🥳',
    keywords: ['party', 'celebration', 'fun', 'happy'],
  },
  {
    id: 'emoji-smile',
    name: 'Smile',
    emoji: '😊',
    keywords: ['smile', 'happy', 'mood', 'joy', 'positive'],
  },
  {
    id: 'emoji-thinking',
    name: 'Thinking',
    emoji: '🤔',
    keywords: ['thinking', 'idea', 'question', 'decision'],
  },
  {
    id: 'emoji-warning',
    name: 'Warning',
    emoji: '⚠️',
    keywords: ['warning', 'alert', 'important', 'caution'],
  },
  {
    id: 'emoji-lock',
    name: 'Security',
    emoji: '🔒',
    keywords: ['lock', 'security', 'private', 'safe', 'protection'],
  },
  {
    id: 'emoji-key',
    name: 'Key',
    emoji: '🔑',
    keywords: ['key', 'access', 'security', 'important'],
  },
  {
    id: 'emoji-home',
    name: 'House',
    emoji: '🏠',
    keywords: ['house', 'home', 'family', 'chores'],
  },
  {
    id: 'emoji-car',
    name: 'Car',
    emoji: '🚗',
    keywords: ['car', 'drive', 'travel', 'transport', 'errands'],
  },
  {
    id: 'emoji-plane',
    name: 'Airplane',
    emoji: '✈️',
    keywords: ['plane', 'airplane', 'travel', 'trip', 'vacation'],
  },
  {
    id: 'emoji-ship',
    name: 'Ship',
    emoji: '🚢',
    keywords: ['ship', 'boat', 'travel', 'cruise', 'vacation'],
  },
  {
    id: 'emoji-dog',
    name: 'Dog',
    emoji: '🐶',
    keywords: ['dog', 'pet', 'animal'],
  },
  {
    id: 'emoji-cat',
    name: 'Cat',
    emoji: '🐱',
    keywords: ['cat', 'pet', 'animal'],
  },
  {
    id: 'emoji-butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    keywords: ['butterfly', 'nature', 'garden', 'change'],
  },
  {
    id: 'emoji-earth',
    name: 'Earth',
    emoji: '🌍',
    keywords: ['earth', 'world', 'planet', 'nature', 'environment'],
  },
  {
    id: 'emoji-ocean',
    name: 'Ocean',
    emoji: '🌊',
    keywords: ['ocean', 'sea', 'water', 'beach', 'travel'],
  },
  {
    id: 'emoji-mountain',
    name: 'Mountain',
    emoji: '⛰️',
    keywords: ['mountain', 'hiking', 'outdoors', 'travel', 'adventure'],
  },
  {
    id: 'emoji-cactus',
    name: 'Cactus',
    emoji: '🌵',
    keywords: ['cactus', 'plant', 'desert', 'nature', 'garden'],
  },
  {
    id: 'emoji-sunflower',
    name: 'Sunflower',
    emoji: '🌻',
    keywords: ['sunflower', 'flower', 'garden', 'summer', 'nature'],
  },
  {
    id: 'emoji-rose',
    name: 'Rose',
    emoji: '🌹',
    keywords: ['rose', 'flower', 'love', 'romance', 'garden'],
  },
  {
    id: 'emoji-mushroom',
    name: 'Mushroom',
    emoji: '🍄',
    keywords: ['mushroom', 'nature', 'forest', 'garden'],
  },
  {
    id: 'emoji-tree',
    name: 'Tree',
    emoji: '🌳',
    keywords: ['tree', 'forest', 'nature', 'outdoors', 'environment'],
  },
  {
    id: 'emoji-maple-leaf',
    name: 'Maple Leaf',
    emoji: '🍁',
    keywords: ['leaf', 'autumn', 'fall', 'nature', 'season'],
  },
  {
    id: 'emoji-seedling',
    name: 'Seedling',
    emoji: '🌱',
    keywords: ['seedling', 'plant', 'growth', 'garden', 'nature'],
  },
  {
    id: 'emoji-bee',
    name: 'Bee',
    emoji: '🐝',
    keywords: ['bee', 'animal', 'garden', 'nature', 'work'],
  },
  {
    id: 'emoji-bird',
    name: 'Bird',
    emoji: '🐦',
    keywords: ['bird', 'animal', 'nature', 'outdoors'],
  },
  {
    id: 'emoji-fish',
    name: 'Fish',
    emoji: '🐟',
    keywords: ['fish', 'animal', 'ocean', 'water', 'pet'],
  },
  {
    id: 'emoji-unicorn',
    name: 'Unicorn',
    emoji: '🦄',
    keywords: ['unicorn', 'magic', 'fantasy', 'creative', 'fun'],
  },
  {
    id: 'emoji-rocket',
    name: 'Rocket',
    emoji: '🚀',
    keywords: ['rocket', 'launch', 'space', 'startup', 'growth'],
  },
  {
    id: 'emoji-bicycle',
    name: 'Bicycle',
    emoji: '🚲',
    keywords: ['bicycle', 'bike', 'cycling', 'exercise', 'transport'],
  },
  {
    id: 'emoji-train',
    name: 'Train',
    emoji: '🚆',
    keywords: ['train', 'travel', 'commute', 'transport'],
  },
  {
    id: 'emoji-scooter',
    name: 'Scooter',
    emoji: '🛴',
    keywords: ['scooter', 'travel', 'commute', 'transport'],
  },
  {
    id: 'emoji-house-garden',
    name: 'House with Garden',
    emoji: '🏡',
    keywords: ['house', 'home', 'garden', 'family', 'outdoors'],
  },
  {
    id: 'emoji-office',
    name: 'Office',
    emoji: '🏢',
    keywords: ['office', 'work', 'business', 'building'],
  },
  {
    id: 'emoji-school',
    name: 'School',
    emoji: '🏫',
    keywords: ['school', 'study', 'education', 'learning'],
  },
  {
    id: 'emoji-hospital',
    name: 'Hospital',
    emoji: '🏥',
    keywords: ['hospital', 'medical', 'health', 'doctor'],
  },
  {
    id: 'emoji-bank',
    name: 'Bank',
    emoji: '🏦',
    keywords: ['bank', 'finance', 'money', 'business'],
  },
  {
    id: 'emoji-soccer',
    name: 'Soccer',
    emoji: '⚽',
    keywords: ['soccer', 'football', 'sport', 'exercise', 'game'],
  },
  {
    id: 'emoji-basketball',
    name: 'Basketball',
    emoji: '🏀',
    keywords: ['basketball', 'sport', 'exercise', 'game'],
  },
  {
    id: 'emoji-tennis',
    name: 'Tennis',
    emoji: '🎾',
    keywords: ['tennis', 'sport', 'exercise', 'game'],
  },
  {
    id: 'emoji-medal',
    name: 'Medal',
    emoji: '🏅',
    keywords: ['medal', 'achievement', 'award', 'sport', 'win'],
  },
  {
    id: 'emoji-crown',
    name: 'Crown',
    emoji: '👑',
    keywords: ['crown', 'winner', 'achievement', 'royal', 'important'],
  },
  {
    id: 'emoji-handshake',
    name: 'Handshake',
    emoji: '🤝',
    keywords: ['handshake', 'team', 'agreement', 'business', 'people'],
  },
  {
    id: 'emoji-wave',
    name: 'Wave',
    emoji: '👋',
    keywords: ['wave', 'hello', 'goodbye', 'people', 'welcome'],
  },
  {
    id: 'emoji-thumbs-up',
    name: 'Thumbs Up',
    emoji: '👍',
    keywords: ['thumbs', 'up', 'approve', 'good', 'success'],
  },
  {
    id: 'emoji-clap',
    name: 'Clap',
    emoji: '👏',
    keywords: ['clap', 'applause', 'celebrate', 'success', 'support'],
  },
  {
    id: 'emoji-pray',
    name: 'Prayer',
    emoji: '🙏',
    keywords: ['pray', 'prayer', 'thanks', 'hope', 'faith'],
  },
  {
    id: 'emoji-eyes',
    name: 'Eyes',
    emoji: '👀',
    keywords: ['eyes', 'look', 'review', 'attention', 'watch'],
  },
  {
    id: 'emoji-brain',
    name: 'Brain',
    emoji: '🧠',
    keywords: ['brain', 'thinking', 'study', 'learning', 'ideas'],
  },
  {
    id: 'emoji-speech',
    name: 'Speech',
    emoji: '💬',
    keywords: ['speech', 'chat', 'message', 'communication', 'people'],
  },
  {
    id: 'emoji-bookmark',
    name: 'Bookmark',
    emoji: '🔖',
    keywords: ['bookmark', 'save', 'reading', 'notes', 'important'],
  },
  {
    id: 'emoji-folder',
    name: 'Folder',
    emoji: '📁',
    keywords: ['folder', 'files', 'organize', 'project', 'work'],
  },
  {
    id: 'emoji-clipboard',
    name: 'Clipboard',
    emoji: '📋',
    keywords: ['clipboard', 'checklist', 'tasks', 'admin', 'notes'],
  },
  {
    id: 'emoji-pushpin',
    name: 'Pushpin',
    emoji: '📌',
    keywords: ['pin', 'pushpin', 'important', 'reminder', 'notes'],
  },
  {
    id: 'emoji-paperclip',
    name: 'Paperclip',
    emoji: '📎',
    keywords: ['paperclip', 'attachment', 'admin', 'office', 'files'],
  },
  {
    id: 'emoji-lightning',
    name: 'Lightning',
    emoji: '⚡',
    keywords: ['lightning', 'energy', 'fast', 'power', 'urgent'],
  },
  {
    id: 'emoji-battery',
    name: 'Battery',
    emoji: '🔋',
    keywords: ['battery', 'energy', 'power', 'charge', 'device'],
  },
  {
    id: 'emoji-settings',
    name: 'Settings',
    emoji: '⚙️',
    keywords: ['settings', 'tools', 'configure', 'maintenance'],
  },
  {
    id: 'emoji-hammer',
    name: 'Hammer',
    emoji: '🔨',
    keywords: ['hammer', 'build', 'repair', 'tools', 'work'],
  },
  {
    id: 'emoji-microscope',
    name: 'Microscope',
    emoji: '🔬',
    keywords: ['microscope', 'science', 'research', 'study', 'lab'],
  },
  {
    id: 'emoji-television',
    name: 'Television',
    emoji: '📺',
    keywords: ['television', 'tv', 'movie', 'watch', 'entertainment'],
  },
  {
    id: 'emoji-movie',
    name: 'Movie Camera',
    emoji: '🎥',
    keywords: ['movie', 'film', 'camera', 'video', 'creative'],
  },
  {
    id: 'emoji-video-game',
    name: 'Video Game',
    emoji: '🎮',
    keywords: ['game', 'gaming', 'play', 'entertainment'],
  },
  {
    id: 'emoji-dice',
    name: 'Dice',
    emoji: '🎲',
    keywords: ['dice', 'game', 'random', 'fun', 'play'],
  },
  {
    id: 'emoji-art',
    name: 'Artist Palette',
    emoji: '🎨',
    keywords: ['art', 'artist', 'creative', 'design', 'paint'],
  },
  {
    id: 'emoji-microphone',
    name: 'Microphone',
    emoji: '🎙️',
    keywords: ['microphone', 'music', 'podcast', 'voice', 'recording'],
  },
  {
    id: 'emoji-guitar',
    name: 'Guitar',
    emoji: '🎸',
    keywords: ['guitar', 'music', 'instrument', 'band', 'practice'],
  },
  {
    id: 'emoji-drum',
    name: 'Drum',
    emoji: '🥁',
    keywords: ['drum', 'music', 'instrument', 'band', 'rhythm'],
  },
  {
    id: 'emoji-musical-notes',
    name: 'Musical Notes',
    emoji: '🎶',
    keywords: ['music', 'song', 'audio', 'listen', 'sound'],
  },
  {
    id: 'emoji-bread',
    name: 'Bread',
    emoji: '🍞',
    keywords: ['bread', 'food', 'baking', 'breakfast', 'meal'],
  },
  {
    id: 'emoji-cheese',
    name: 'Cheese',
    emoji: '🧀',
    keywords: ['cheese', 'food', 'meal', 'cooking'],
  },
  {
    id: 'emoji-ramen',
    name: 'Ramen',
    emoji: '🍜',
    keywords: ['ramen', 'noodles', 'food', 'meal', 'cooking'],
  },
  {
    id: 'emoji-sushi',
    name: 'Sushi',
    emoji: '🍣',
    keywords: ['sushi', 'food', 'meal', 'restaurant'],
  },
  {
    id: 'emoji-ice-cream',
    name: 'Ice Cream',
    emoji: '🍦',
    keywords: ['ice cream', 'dessert', 'food', 'summer', 'treat'],
  },
  {
    id: 'emoji-watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    keywords: ['watermelon', 'fruit', 'food', 'summer'],
  },
  {
    id: 'emoji-lemon',
    name: 'Lemon',
    emoji: '🍋',
    keywords: ['lemon', 'fruit', 'food', 'fresh', 'cooking'],
  },
  {
    id: 'emoji-wine',
    name: 'Wine',
    emoji: '🍷',
    keywords: ['wine', 'drink', 'dinner', 'celebration'],
  },
  {
    id: 'emoji-beer',
    name: 'Beer',
    emoji: '🍺',
    keywords: ['beer', 'drink', 'party', 'celebration'],
  },
  {
    id: 'emoji-mug',
    name: 'Mug',
    emoji: '🍵',
    keywords: ['tea', 'mug', 'drink', 'coffee', 'break'],
  },
  {
    id: 'emoji-shopping-bags',
    name: 'Shopping Bags',
    emoji: '🛍️',
    keywords: ['shopping', 'bags', 'shop', 'buy', 'errands'],
  },
  {
    id: 'emoji-tshirt',
    name: 'Clothing',
    emoji: '👕',
    keywords: ['clothing', 'shirt', 'shopping', 'laundry', 'fashion'],
  },
  {
    id: 'emoji-glasses',
    name: 'Glasses',
    emoji: '👓',
    keywords: ['glasses', 'vision', 'reading', 'accessibility'],
  },
  {
    id: 'emoji-syringe',
    name: 'Syringe',
    emoji: '💉',
    keywords: ['syringe', 'vaccine', 'medical', 'health', 'appointment'],
  },
  {
    id: 'emoji-bandage',
    name: 'Bandage',
    emoji: '🩹',
    keywords: ['bandage', 'care', 'health', 'first aid', 'medical'],
  },
  {
    id: 'emoji-pill',
    name: 'Pill',
    emoji: '💊',
    keywords: ['pill', 'medicine', 'medication', 'health'],
  },
  {
    id: 'emoji-wheelchair',
    name: 'Accessibility',
    emoji: '♿',
    keywords: ['accessibility', 'wheelchair', 'care', 'support'],
  },
  {
    id: 'emoji-recycle',
    name: 'Recycle',
    emoji: '♻️',
    keywords: ['recycle', 'environment', 'eco', 'sustainability'],
  },
  {
    id: 'emoji-peace',
    name: 'Peace',
    emoji: '☮️',
    keywords: ['peace', 'calm', 'faith', 'mindfulness'],
  },
  {
    id: 'emoji-infinity',
    name: 'Infinity',
    emoji: '♾️',
    keywords: ['infinity', 'habit', 'continuous', 'forever'],
  },
];

const categoryIconById = new Map(
  categoryIconOptions.map((option) => [option.id, option]),
);

function CategoryIcon({ icon }: { icon: string }) {
  const option = categoryIconById.get(icon);
  if (option?.emoji) {
    return (
      <i className="tm-category-icon tm-category-emoji" aria-hidden="true">
        {option.emoji}
      </i>
    );
  }
  return option?.icon ? (
    <FontAwesomeIcon
      className="tm-category-icon"
      icon={option.icon}
      aria-hidden="true"
    />
  ) : (
    <i aria-hidden="true">{icon}</i>
  );
}

const categoryMeta: Record<string, CategoryMeta> = {
  '🗒️ Notes': { icon: '🗒️', label: 'Notes' },
  '🎤 Voice': { icon: '🎤', label: 'Voice' },
  '🧼 Cleaning': { icon: '🧼', label: 'Cleaning' },
  '📗 Study': { icon: '📗', label: 'Study' },
  '👤 People': { icon: '👤', label: 'People' },
};
const deletedDefaultCategoriesKey = 'caxius-todo.deleted-default-categories.v1';

function readDeletedDefaultCategories() {
  try {
    const saved = window.localStorage.getItem(deletedDefaultCategoriesKey);
    const names = saved ? JSON.parse(saved) : [];
    return new Set(
      Array.isArray(names)
        ? names.filter(
            (name): name is string =>
              typeof name === 'string' && Boolean(categoryMeta[name]),
          )
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

function loadCategoryConfig() {
  const defaults =
    typeof window === 'undefined'
      ? categoryMeta
      : Object.fromEntries(
          Object.entries(categoryMeta).filter(
            ([name]) => !readDeletedDefaultCategories().has(name),
          ),
        );
  if (typeof window === 'undefined') {
    return { categories: defaults, legacyNames: {} as Record<string, string> };
  }

  const saved = window.localStorage.getItem('caxius-todo.categories.v1');
  if (!saved) {
    return { categories: defaults, legacyNames: {} as Record<string, string> };
  }

  try {
    const custom = JSON.parse(saved) as Record<string, CategoryMeta>;
    if (!custom || typeof custom !== 'object') {
      return { categories: defaults, legacyNames: {} as Record<string, string> };
    }

    const legacyNames: Record<string, string> = {};
    const normalizedCustom = Object.fromEntries(
      Object.entries(custom).map(([name, meta]) => {
        const isLegacyName =
          meta &&
          typeof meta.icon === 'string' &&
          typeof meta.label === 'string' &&
          name === `${meta.icon} ${meta.label}`;
        if (isLegacyName) {
          legacyNames[name] = meta.label;
          return [meta.label, meta];
        }
        return [name, meta];
      }),
    );
    return { categories: { ...defaults, ...normalizedCustom }, legacyNames };
  } catch {
    return { categories: defaults, legacyNames: {} as Record<string, string> };
  }
}

function toDateString(date: Date) {
  return toDateKey(date);
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function displayDueTime(dueTime?: string) {
  if (!dueTime) return '';
  const [hour, minute] = dueTime.split(':').map(Number);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: minute ? '2-digit' : undefined,
  }).format(new Date(2000, 0, 1, hour, minute));
}

function normalizeDueLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dueDisplay(
  dueDate?: string,
  dueTime?: string,
  dueLabel?: string,
  dayEndTime = DEFAULT_DAY_END_TIME,
) {
  if (!dueDate) return { label: 'No date', state: 'none' } as const;
  const now = new Date();
  const today = getDayKey(now, dayEndTime);
  const tomorrow = toDateString(addDays(new Date(`${today}T12:00:00`), 1));
  const time = displayDueTime(dueTime);
  const tooltip = `Due ${formatDeadlineResolution({ date: dueDate, time: dueTime }, { long: true })}`;
  if (dueDate < today)
    return {
      label: time ? `Overdue · ${time}` : 'Overdue',
      state: 'overdue',
      tooltip,
    } as const;
  if (dueDate === today && dueTime) {
    if (dueInstant(dueDate, dueTime, dayEndTime) < now) {
      return { label: `Overdue · ${time}`, state: 'overdue', tooltip } as const;
    }
  }
  if (dueLabel && dueLabel !== 'Exact date')
    return {
      label: normalizeDueLabel(dueLabel),
      state: dueDate === today ? 'today' : 'upcoming',
      tooltip,
    } as const;
  if (dueDate === today)
    return {
      label: time ? `Today · ${time}` : 'Today',
      state: 'today',
      tooltip,
    } as const;
  if (dueDate === tomorrow)
    return {
      label: time ? `Tomorrow · ${time}` : 'Tomorrow',
      state: 'upcoming',
      tooltip,
    } as const;
  const date = new Date(`${dueDate}T12:00:00`);
  return {
    label: new Intl.DateTimeFormat('en', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date),
    state: 'upcoming',
    tooltip,
  } as const;
}

function DayBoundarySettings({
  theme,
  onTheme,
  dayEndTime,
  onDayEndTimeChange,
  tasks,
}: {
  theme: Theme;
  onTheme: () => void;
  dayEndTime: string;
  onDayEndTimeChange: (time: string) => void;
  tasks: Task[];
}) {
  const displayTime = formatClockTime(dayEndTime);
  const isMidnight = dayEndTime === DEFAULT_DAY_END_TIME;
  return (
    <Dialog>
      <DialogTrigger className="tm-settings-trigger" aria-label="Open settings">
        <span className="tm-settings-trigger-desktop">
          <Settings2Icon />
        </span>
        <span className="tm-settings-trigger-mobile">
          <MoreIcon />
        </span>
        <span>Settings</span>
      </DialogTrigger>
      <DialogContent className="tm-settings-dialog">
        <div className="tm-settings-mobile-activity">
          <WorkDonePanel tasks={tasks} dayEndTime={dayEndTime} />
        </div>
        <DialogHeader className="tm-settings-heading">
          <span className="tm-settings-icon">
            <Settings2Icon />
          </span>
          <div>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Shape the app around the way your day actually works.
            </DialogDescription>
          </div>
        </DialogHeader>
        <section className="tm-theme-setting" aria-labelledby="theme-label">
          <div>
            <span id="theme-label">Appearance</span>
            <p>Choose the color theme for your workspace.</p>
          </div>
          <button
            type="button"
            className="tm-theme-toggle"
            onClick={onTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </section>
        <section
          className="tm-day-boundary-setting"
          aria-labelledby="day-boundary-label"
        >
          <div>
            <label id="day-boundary-label" htmlFor="day-end-time">
              Your day ends at
            </label>
            <p>
              Until then, late-night work and unfinished tasks stay in the
              previous day.
            </p>
          </div>
          <input
            id="day-end-time"
            type="time"
            value={dayEndTime}
            onChange={(event) => onDayEndTimeChange(event.target.value)}
          />
        </section>
        <div
          className="tm-day-boundary-presets"
          aria-label="Common day end times"
        >
          {[
            { value: '00:00', label: 'Midnight' },
            { value: '02:00', label: '2 AM' },
            { value: '04:00', label: '4 AM' },
          ].map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={dayEndTime === preset.value ? 'active' : ''}
              onClick={() => onDayEndTimeChange(preset.value)}
              aria-pressed={dayEndTime === preset.value}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="tm-day-boundary-example" aria-live="polite">
          {isMidnight
            ? 'Your day changes at midnight.'
            : `At ${displayTime}, a task due Monday is still due until ${displayTime} on Tuesday.`}
        </p>
      </DialogContent>
    </Dialog>
  );
}

function NavIcon({ view }: { view: View }) {
  if (view === 'tasks') return <ListIcon />;
  if (view === 'timeline') return <TimelineIcon />;
  if (view === 'shelf') return <ArchiveIcon />;
  if (view === 'habits') return <RepeatIcon />;
  if (view === 'projects') return <FolderIcon />;
  return <PaletteIcon />;
}

function BrandMark() {
  return (
    <span className="tm-brand-mark">
      <img src="/taelos-mark.svg" alt="" aria-hidden="true" />
    </span>
  );
}

function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d={collapsed ? 'm8 5 5 5-5 5' : 'm12 5-5 5 5 5'} />
    </svg>
  );
}

function Navigation({
  view,
  activeCount,
  collapsed,
  onView,
  onCollapsedChange,
}: {
  view: View;
  activeCount: number;
  collapsed: boolean;
  onView: (view: View) => void;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const mobileViews: View[] = ['tasks', 'timeline', 'shelf'];
  return (
    <>
      <aside className={`tm-sidebar${collapsed ? ' is-collapsed' : ''}`}>
        <button
          className="tm-brand"
          type="button"
          onClick={() => onView('tasks')}
        >
          <BrandMark />
          <img
            className="tm-brand-wordmark"
            src="/taelos-wordmark.svg"
            alt="TÆLOS"
          />
        </button>
        <button
          className="tm-sidebar-toggle"
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <SidebarToggleIcon collapsed={collapsed} />
        </button>
        <nav className="tm-primary-nav" aria-label="Main areas">
          {(['tasks', 'timeline', 'shelf'] as View[]).map((item) => (
            <button
              key={item}
              type="button"
              className={view === item ? 'active' : ''}
              aria-current={view === item ? 'page' : undefined}
              aria-keyshortcuts={item === 'tasks' ? '1' : item === 'timeline' ? '2' : '3'}
              onClick={() => onView(item)}
              title={
                collapsed ? item[0].toUpperCase() + item.slice(1) : undefined
              }
            >
              <NavIcon view={item} />
              <span>{item[0].toUpperCase() + item.slice(1)}</span>
              <kbd className="tm-nav-key">
                {item === 'tasks' ? '1' : item === 'timeline' ? '2' : '3'}
              </kbd>
              {item === 'tasks' && <small>{activeCount}</small>}
            </button>
          ))}
        </nav>
        <SignOutButton compact={collapsed} />
      </aside>

      <nav className="app-mobile-nav" aria-label="Primary mobile navigation">
        {mobileViews.map((item) => (
          <button
            key={item}
            type="button"
            className={view === item ? 'active' : ''}
            aria-label={item}
            aria-current={view === item ? 'page' : undefined}
            onClick={() => onView(item)}
          >
            <NavIcon view={item} />
            <span>{item[0].toUpperCase() + item.slice(1)}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

interface RowData {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  dueLabel?: string;
  category: string;
  progress?: { current: number; target?: number; unit: ProgressUnit };
  workLog?: WorkLogEntry[];
  subtasks: Subtask[];
}

type TaskEditChanges = Pick<
  RowData,
  'title' | 'dueDate' | 'dueTime' | 'dueLabel' | 'category'
> & {
  subtasks?: Subtask[];
};

type DeferredDeadline = Pick<RowData, 'dueDate' | 'dueTime' | 'dueLabel'>;

function deferredBaseDate(row: RowData, dayEndTime: string) {
  const today = getDayKey(new Date(), dayEndTime);
  return new Date(
    `${row.dueDate && row.dueDate > today ? row.dueDate : today}T12:00:00`,
  );
}

function deferByDays(
  row: RowData,
  days: number,
  label: string,
  dayEndTime: string,
): DeferredDeadline {
  return {
    dueDate: toDateString(addDays(deferredBaseDate(row, dayEndTime), days)),
    dueTime: row.dueTime,
    dueLabel: label,
  };
}

function deferByHour(dayEndTime: string): DeferredDeadline {
  const deferred = new Date();
  deferred.setHours(deferred.getHours() + 1);
  return {
    dueDate: getDayKey(deferred, dayEndTime),
    dueTime: `${String(deferred.getHours()).padStart(2, '0')}:${String(deferred.getMinutes()).padStart(2, '0')}`,
    dueLabel: 'In 1 hour',
  };
}

function nextWeekendDate(row: RowData, dayEndTime: string) {
  const base = deferredBaseDate(row, dayEndTime);
  const daysUntilSunday = (7 - base.getDay()) % 7;
  const thisSunday = addDays(base, daysUntilSunday);
  return toDateString(addDays(thisSunday, 7));
}

function CompletionCircle({
  checked,
  workLevel = 0,
  label,
  onChange,
}: {
  checked: boolean;
  workLevel?: number;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`tm-completion${workLevel ? ` has-work work-level-${workLevel}` : ''}`}
    >
      <input
        data-keyboard-complete
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span>{checked && <CheckIcon />}</span>
    </label>
  );
}

function WorkDoneCell({ row, onChip }: { row: RowData; onChip: () => void }) {
  const canLogWork = row.subtasks.length === 0;

  return (
    <div className="tm-work-cell">
      {!row.completed && canLogWork && (
        <IconButton
          label={`Log work for ${row.title}`}
          size="small"
          onClick={onChip}
          className="tm-chip-away"
        >
          <PickaxeIcon />
        </IconButton>
      )}
      <output className={row.completed ? 'complete' : ''}>
        {formatWorkDone(row)}
      </output>
    </div>
  );
}

function DueCell({ due }: { due: ReturnType<typeof dueDisplay> }) {
  const content = (
    <>
      {due.state === 'overdue' && <WarningIcon />}
      {due.state !== 'none' && due.state !== 'overdue' && <CalendarIcon />}
      <span>{due.label}</span>
    </>
  );
  if (!('tooltip' in due))
    return <div className={`tm-due-cell ${due.state}`}>{content}</div>;
  return (
    <Tooltip>
      <TooltipTrigger
        className={`tm-due-cell ${due.state}`}
        aria-label={`${due.label}. ${due.tooltip}`}
      >
        {content}
      </TooltipTrigger>
      <TooltipContent className="tm-due-tooltip" side="top">
        {due.tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function DeferTaskDialog({
  row,
  dayEndTime,
  onDefer,
  onClose,
}: {
  row: RowData;
  dayEndTime: string;
  onDefer: (deadline: DeferredDeadline) => void;
  onClose: () => void;
}) {
  const [exactDateOpen, setExactDateOpen] = useState(false);
  const [exactDate, setExactDate] = useState(row.dueDate ?? '');
  const [exactTime, setExactTime] = useState(row.dueTime ?? '');
  const [naturalLanguageDate, setNaturalLanguageDate] = useState('');
  const [naturalLanguageTouched, setNaturalLanguageTouched] = useState(false);
  const currentDue = dueDisplay(
    row.dueDate,
    row.dueTime,
    row.dueLabel,
    dayEndTime,
  );
  const resolvedNaturalLanguageDate = naturalLanguageDate
    ? parseHumanDeadline(naturalLanguageDate, new Date(), dayEndTime)
    : undefined;

  const deferToNaturalLanguageDate = () => {
    setNaturalLanguageTouched(true);
    if (!resolvedNaturalLanguageDate) return;
    onDefer({
      dueDate: resolvedNaturalLanguageDate.date,
      dueTime: resolvedNaturalLanguageDate.time,
      dueLabel: resolvedNaturalLanguageDate.label,
    });
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const options: Array<{
    title: string;
    detail: string;
    deadline: DeferredDeadline;
  }> = [
    {
      title: 'In 1 hour',
      detail: 'Keep this near the top of your day.',
      deadline: deferByHour(dayEndTime),
    },
    {
      title: 'Tomorrow',
      detail: 'Move it forward one day and keep its time.',
      deadline: deferByDays(row, 1, 'Tomorrow', dayEndTime),
    },
    {
      title: 'In 2 days',
      detail: 'Give it a little more breathing room.',
      deadline: deferByDays(row, 2, 'In 2 days', dayEndTime),
    },
    {
      title: 'Next week',
      detail: 'Shift the current deadline by a full week.',
      deadline: deferByDays(row, 7, 'Next week', dayEndTime),
    },
    {
      title: 'Next weekend',
      detail: 'Land it at the end of next weekend.',
      deadline: {
        dueDate: nextWeekendDate(row, dayEndTime),
        dueTime: row.dueTime,
        dueLabel: 'Next weekend',
      },
    },
  ];

  return createPortal(
    <div
      className="tm-defer-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <dialog
        open
        className="tm-defer-dialog"
        aria-modal="true"
        aria-labelledby={`defer-dialog-title-${row.id}`}
      >
        <div className="tm-defer-dialog-content">
          <div className="tm-defer-dialog-heading">
            <span className="tm-defer-dialog-icon">
              <DeferIcon />
            </span>
            <div>
              <strong id={`defer-dialog-title-${row.id}`}>Defer task</strong>
              <span>{row.title}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close defer dialog"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="tm-defer-current">
            Currently due <strong>{currentDue.label}</strong>
          </p>
          <form
            className="tm-defer-natural-language"
            onSubmit={(event) => {
              event.preventDefault();
              deferToNaturalLanguageDate();
            }}
          >
            <label htmlFor={`defer-natural-date-${row.id}`}>
              When should this happen instead?
            </label>
            <div
              className={`tm-defer-natural-language-input${naturalLanguageTouched && naturalLanguageDate && !resolvedNaturalLanguageDate ? ' invalid' : ''}`}
            >
              <CalendarIcon />
              <input
                id={`defer-natural-date-${row.id}`}
                value={naturalLanguageDate}
                onChange={(event) => {
                  setNaturalLanguageDate(event.target.value);
                  setNaturalLanguageTouched(false);
                }}
                placeholder="Next Tuesday at 3pm"
                aria-describedby={`defer-natural-date-help-${row.id}`}
                aria-invalid={
                  naturalLanguageTouched &&
                  !!naturalLanguageDate &&
                  !resolvedNaturalLanguageDate
                }
              />
              {naturalLanguageDate && (
                <button
                  type="button"
                  aria-label="Clear described defer date"
                  onClick={() => {
                    setNaturalLanguageDate('');
                    setNaturalLanguageTouched(false);
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <div
              className="tm-defer-natural-language-footer"
              id={`defer-natural-date-help-${row.id}`}
              aria-live="polite"
            >
              {resolvedNaturalLanguageDate ? (
                <span>
                  Move to{' '}
                  <strong>
                    {formatDeadlineResolution(resolvedNaturalLanguageDate)}
                  </strong>
                </span>
              ) : naturalLanguageTouched && naturalLanguageDate ? (
                <span>Try “tomorrow at 9am” or “next Friday afternoon”.</span>
              ) : (
                <span>
                  Use plain language, like “in 3 days” or “next weekend”.
                </span>
              )}
              <button type="submit" disabled={!resolvedNaturalLanguageDate}>
                Defer
              </button>
            </div>
          </form>
          <div className="tm-defer-options" aria-label="Defer by a set amount">
            {options.map((option) => (
              <button
                key={option.title}
                type="button"
                onClick={() => onDefer(option.deadline)}
              >
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.detail}</small>
                </span>
                <time>
                  {formatDeadlineResolution({
                    date: option.deadline.dueDate!,
                    time: option.deadline.dueTime,
                  })}
                </time>
              </button>
            ))}
          </div>
          <div className="tm-defer-exact">
            <button
              type="button"
              className="tm-defer-exact-toggle"
              onClick={() => setExactDateOpen((open) => !open)}
              aria-expanded={exactDateOpen}
            >
              <CalendarIcon />
              <span>Choose an exact date</span>
              <ChevronIcon direction={exactDateOpen ? 'down' : 'right'} />
            </button>
            {exactDateOpen && (
              <div className="tm-defer-exact-fields">
                <label>
                  Date
                  <input
                    type="date"
                    value={exactDate}
                    onChange={(event) => setExactDate(event.target.value)}
                  />
                </label>
                <label>
                  Time <span>optional</span>
                  <input
                    type="time"
                    value={exactTime}
                    onChange={(event) => setExactTime(event.target.value)}
                    disabled={!exactDate}
                  />
                </label>
                <button
                  type="button"
                  disabled={!exactDate}
                  onClick={() =>
                    onDefer({
                      dueDate: exactDate,
                      dueTime: exactTime || undefined,
                      dueLabel: 'Exact date',
                    })
                  }
                >
                  Defer to this date
                </button>
              </div>
            )}
          </div>
          <div className="tm-defer-dialog-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>,
    document.body,
  );
}

function TaskGridRow({
  row,
  categories,
  dayEndTime,
  depth = 0,
  expanded,
  chipOpen,
  onToggleExpand,
  onToggleComplete,
  onChip,
  onRecordWork,
  onDefer,
  onEdit,
  onDelete,
  onShelf,
}: {
  row: RowData;
  categories: Record<string, CategoryMeta>;
  dayEndTime: string;
  depth?: number;
  expanded?: boolean;
  chipOpen: boolean;
  onToggleExpand?: () => void;
  onToggleComplete: () => void;
  onChip: () => void;
  onRecordWork: (amount: number, unit: ProgressUnit) => void;
  onDefer: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShelf: () => void;
}) {
  const due = dueDisplay(row.dueDate, row.dueTime, row.dueLabel, dayEndTime);
  const category = categories[row.category] ?? {
    icon: '🏷️',
    label: row.category,
  };
  const loggedWorkSessions = Math.max(
    row.workLog?.length ?? 0,
    row.progress && row.progress.current > 0 ? 1 : 0,
  );
  const workLevel =
    !row.completed && row.subtasks.length === 0 && loggedWorkSessions
      ? Math.min(9, 4 + loggedWorkSessions)
      : 0;
  return (
    <div
      className={`tm-row-wrap${depth ? ' child' : ''}${row.completed ? ' completed' : ''}`}
      data-keyboard-task-row
    >
      <div
        className="tm-task-row"
        style={{ '--depth': depth } as CSSProperties}
      >
        <div className="tm-title-cell">
          <CompletionCircle
            checked={row.completed}
            workLevel={workLevel}
            label={`Mark ${row.title} ${row.completed ? 'incomplete' : 'complete'}`}
            onChange={onToggleComplete}
          />
          {row.subtasks.length > 0 && (
            <button
              type="button"
              className="tm-expand-button"
              onClick={onToggleExpand}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} ${row.title}`}
              aria-expanded={expanded}
            >
              <ChevronIcon direction={expanded ? 'down' : 'right'} />
            </button>
          )}
          <button
            type="button"
            className="tm-title-button"
            data-keyboard-task
            data-task-key={row.id}
            onClick={row.subtasks.length ? onToggleExpand : onChip}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (row.subtasks.length) onToggleExpand?.();
              } else if (event.key.toLowerCase() === 'e') {
                event.preventDefault();
                onEdit();
              }
            }}
            aria-expanded={row.subtasks.length ? expanded : undefined}
            aria-keyshortcuts="Enter E"
          >
            <span>{row.title}</span>
          </button>
        </div>
        <div className="tm-task-meta">
          <WorkDoneCell row={row} onChip={onChip} />
          <DueCell due={due} />
          <div className="tm-category-cell" title={row.category}>
            <CategoryIcon icon={category.icon} />
          </div>
        </div>
        <IconButton
          label={`Defer ${row.title}`}
          size="small"
          onClick={onDefer}
          disabled={row.completed}
          className="tm-defer-button"
        >
          <DeferIcon />
        </IconButton>
        <div className="tm-compact-menu">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <IconButton
                  label={`More actions for ${row.title}`}
                  size="small"
                  className="tm-more-button"
                >
                  <MoreIcon />
                </IconButton>
              }
            />
            <DropdownMenuContent
              className="tm-task-menu"
              align="end"
              sideOffset={7}
              aria-label={`Actions for ${row.title}`}
            >
              <DropdownMenuItem onClick={onDefer} disabled={row.completed}>
                <DeferIcon />
                <span>Defer</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <EditIcon />
                <span>Edit task</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShelf}>
                <ArchiveIcon />
                <span>Move to shelf</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <TrashIcon />
                <span>Delete task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="tm-row-actions">
          <IconButton
            label={`Delete ${row.title}`}
            size="small"
            onClick={onDelete}
          >
            <TrashIcon />
          </IconButton>
          <IconButton label={`Edit ${row.title}`} size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton
            label={`Move ${row.title} to Shelf`}
            size="small"
            onClick={onShelf}
          >
            <ArchiveIcon />
          </IconButton>
        </div>
      </div>
      {chipOpen && !row.completed && row.subtasks.length === 0 && (
        <ChipAwayDialog row={row} onRecord={onRecordWork} onClose={onChip} />
      )}
    </div>
  );
}

const progressUnits: Array<{
  value: ProgressUnit;
  label: string;
  example: string;
}> = [
  { value: 'items', label: 'Items', example: 'pages, boxes, calls' },
  { value: 'minutes', label: 'Minutes', example: 'time spent' },
  { value: 'hours', label: 'Hours', example: 'time spent' },
  { value: 'words', label: 'Words', example: 'written or reviewed' },
  { value: 'reps', label: 'Reps', example: 'repeated actions' },
];

function ChipAwayDialog({
  row,
  onRecord,
  onClose,
}: {
  row: RowData;
  onRecord: (amount: number, unit: ProgressUnit) => void;
  onClose: () => void;
}) {
  const isConfigured = Boolean(row.progress);
  const [unitChoice, setUnitChoice] = useState(row.progress?.unit ?? 'minutes');
  const [customUnit, setCustomUnit] = useState('');
  const [amount, setAmount] = useState('');
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    if (isConfigured) amountInputRef.current?.focus();
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isConfigured, onClose]);

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const unit =
      row.progress?.unit ??
      (unitChoice === 'custom' ? customUnit.trim() : unitChoice);
    const numericAmount = Number(amount);
    if (!unit || !Number.isFinite(numericAmount) || numericAmount <= 0) return;
    onRecord(numericAmount, unit);
    onClose();
  };
  const amountUnit =
    row.progress?.unit ??
    (unitChoice === 'custom' ? customUnit.trim() || 'units' : unitChoice);

  const dialog = (
    <div
      className="tm-work-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <dialog
        open
        className="tm-work-dialog"
        aria-modal="true"
        aria-labelledby={`work-dialog-title-${row.id}`}
      >
        <form className="tm-work-dialog-form" onSubmit={submit}>
          <div className="tm-work-dialog-heading">
            <span className="tm-work-dialog-icon">
              <PickaxeIcon />
            </span>
            <div>
              <strong id={`work-dialog-title-${row.id}`}>
                {isConfigured ? 'Log work' : 'Set up work tracking'}
              </strong>
              <span>{row.title}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close work dialog"
            >
              <CloseIcon />
            </button>
          </div>
          {!isConfigured && (
            <label className="tm-work-dialog-field">
              <span>What unit should measure this work?</span>
              <Select
                value={unitChoice}
                onValueChange={(value) => {
                  if (value) setUnitChoice(value);
                }}
              >
                <SelectTrigger
                  className="tm-site-select-trigger"
                  aria-label="Work tracking unit"
                  autoFocus
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="tm-site-select-content"
                  align="start"
                  sideOffset={6}
                >
                  {progressUnits.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="tm-site-select-item"
                    >
                      {option.label} — {option.example}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="tm-site-select-item">
                    Custom unit…
                  </SelectItem>
                </SelectContent>
              </Select>
              {unitChoice === 'custom' && (
                <input
                  name="customUnit"
                  value={customUnit}
                  onChange={(event) => setCustomUnit(event.target.value)}
                  placeholder="e.g. pages"
                  maxLength={24}
                  required
                />
              )}
            </label>
          )}
          <label className="tm-work-dialog-field">
            <span>How much did you do?</span>
            <div className="tm-work-amount-input">
              <input
                ref={amountInputRef}
                name="amount"
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0"
                required
              />
              <span>{amountUnit}</span>
            </div>
            {row.progress ? (
              <small>
                Already logged: {row.progress.current} {row.progress.unit}
              </small>
            ) : (
              <small>This first entry will start your work history.</small>
            )}
          </label>
          <div className="tm-work-dialog-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              {isConfigured ? 'Log work' : 'Start tracking & log'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
  return createPortal(dialog, document.body);
}

function TaskEditDialog({
  row,
  categories,
  dayEndTime,
  allowSubtasks,
  onSave,
  onClose,
}: {
  row: RowData;
  categories: Record<string, CategoryMeta>;
  dayEndTime: string;
  allowSubtasks: boolean;
  onSave: (changes: TaskEditChanges) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(row.title);
  const [dueDate, setDueDate] = useState(row.dueDate ?? '');
  const [dueTime, setDueTime] = useState(row.dueTime ?? '');
  const [dueLabel, setDueLabel] = useState(
    row.dueLabel ?? (row.dueDate ? 'Exact date' : ''),
  );
  const [deadlineText, setDeadlineText] = useState(
    row.dueLabel ?? row.dueDate ?? '',
  );
  const [deadlineTouched, setDeadlineTouched] = useState(false);
  const [exactDeadlineOpen, setExactDeadlineOpen] = useState(
    !row.dueLabel && !!row.dueDate,
  );
  const [category, setCategory] = useState(row.category);
  const [subtasks, setSubtasks] = useState<Subtask[]>(() =>
    row.subtasks.map((subtask) => ({ ...subtask })),
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskTime, setNewSubtaskTime] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const editDeadlineRef = useRef<HTMLInputElement>(null);
  const editTimeRef = useRef<HTMLInputElement>(null);
  const newSubtaskTitleRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    titleRef.current?.focus();
    titleRef.current?.select();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      requestAnimationFrame(() => returnFocusRef.current?.focus());
    };
  }, [row.id]);

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    const resolved = deadlineText
      ? parseHumanDeadline(deadlineText, new Date(), dayEndTime)
      : undefined;
    const nextDeadline =
      dueLabel === 'Exact date'
        ? {
            date: dueDate || undefined,
            time: dueTime || undefined,
            label: dueDate ? 'Exact date' : undefined,
          }
        : resolved
          ? { date: resolved.date, time: resolved.time, label: resolved.label }
          : { date: undefined, time: undefined, label: undefined };
    const changes: TaskEditChanges = {
      title: nextTitle,
      dueDate: nextDeadline.date,
      dueTime: nextDeadline.time,
      dueLabel: nextDeadline.label,
      category,
    };
    if (allowSubtasks) {
      changes.subtasks = subtasks.map((subtask) => ({
        ...subtask,
        title: subtask.title.trim(),
      }));
      const nextSubtaskTitle = newSubtaskTitle.trim();
      if (nextSubtaskTitle && changes.subtasks.length < 100) {
        changes.subtasks.push({
          id: makeId('subtask'),
          title: nextSubtaskTitle,
          completed: false,
          dueTime: newSubtaskTime || undefined,
        });
      }
    }
    onSave(changes);
    onClose();
  };

  const addSubtask = () => {
    const nextTitle = newSubtaskTitle.trim();
    if (!nextTitle || subtasks.length >= 100) return;
    setSubtasks((current) => [
      ...current,
      {
        id: makeId('subtask'),
        title: nextTitle,
        completed: false,
        dueTime: newSubtaskTime || undefined,
      },
    ]);
    setNewSubtaskTitle('');
    setNewSubtaskTime('');
  };

  const resolvedDeadline = deadlineText
    ? parseHumanDeadline(deadlineText, new Date(), dayEndTime)
    : undefined;
  const applyHumanDeadline = (value: string) => {
    const resolved = parseHumanDeadline(value, new Date(), dayEndTime);
    setDeadlineText(value);
    setDeadlineTouched(true);
    setExactDeadlineOpen(false);
    if (!resolved) {
      setDueDate('');
      setDueTime('');
      setDueLabel('');
      return;
    }
    setDueDate(resolved.date);
    setDueTime(resolved.time ?? '');
    setDueLabel(resolved.label);
  };

  return createPortal(
    <div
      className="tm-edit-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <dialog
        open
        className="tm-edit-dialog"
        aria-modal="true"
        aria-labelledby={`edit-dialog-title-${row.id}`}
      >
        <form onSubmit={submit}>
          <div className="tm-edit-dialog-heading">
            <div>
              <strong id={`edit-dialog-title-${row.id}`}>Edit task</strong>
              <span>Update the details for this task.</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close edit task dialog"
            >
              <CloseIcon />
            </button>
          </div>
          <label className="tm-edit-dialog-field">
            Task name
            <input
              ref={titleRef}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={160}
              required
            />
          </label>
          <div className="tm-edit-dialog-field">
            <label htmlFor={`edit-category-${row.id}`}>Category</label>
            <Select
              value={category}
              onValueChange={(value) => {
                if (value) setCategory(value);
              }}
            >
              <SelectTrigger
                id={`edit-category-${row.id}`}
                className="tm-site-select-trigger"
                aria-label="Task category"
              >
                <span className="tm-site-select-value">
                  <CategoryIcon
                    icon={categories[category]?.icon ?? category}
                  />
                  <span>{categories[category]?.label ?? category}</span>
                </span>
              </SelectTrigger>
              <SelectContent
                className="tm-site-select-content"
                align="start"
                sideOffset={6}
              >
                {Object.entries(categories).map(([name, meta]) => (
                  <SelectItem
                    key={name}
                    value={name}
                    className="tm-site-select-item"
                  >
                    <CategoryIcon icon={meta.icon} />
                    <span>{meta.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sg-human-deadline tm-edit-human-deadline">
            <label htmlFor={`edit-deadline-${row.id}`}>
              When does this need to happen?
            </label>
            <div
              className={`sg-deadline-input${deadlineTouched && deadlineText && !resolvedDeadline ? ' invalid' : ''}`}
            >
              <CalendarIcon />
              <input
                ref={editDeadlineRef}
                id={`edit-deadline-${row.id}`}
                value={deadlineText}
                onChange={(event) => {
                  setDeadlineText(event.target.value);
                  setDeadlineTouched(false);
                }}
                onBlur={() => applyHumanDeadline(deadlineText)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyHumanDeadline(deadlineText);
                    submit(event);
                  } else if (event.key === 'Tab' && !event.shiftKey) {
                    event.preventDefault();
                    applyHumanDeadline(deadlineText);
                    setExactDeadlineOpen(true);
                    requestAnimationFrame(() => editTimeRef.current?.focus());
                  }
                }}
                placeholder="Tomorrow at 9am, this weekend…"
                aria-describedby={`edit-deadline-help-${row.id}`}
                aria-invalid={
                  deadlineTouched && !!deadlineText && !resolvedDeadline
                }
              />
              {deadlineText && (
                <button
                  type="button"
                  aria-label="Clear deadline"
                  onClick={() => applyHumanDeadline('')}
                >
                  ×
                </button>
              )}
            </div>
            <div
              className="sg-deadline-presets"
              aria-label="Quick deadline choices"
            >
              {['Tomorrow morning', 'This weekend', 'Next weekend'].map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyHumanDeadline(value)}
                  >
                    {value}
                  </button>
                ),
              )}
            </div>
            <div
              className="sg-deadline-feedback"
              id={`edit-deadline-help-${row.id}`}
              aria-live="polite"
            >
              {resolvedDeadline ? (
                <>
                  <CheckIcon />
                  <span>
                    Understood:{' '}
                    <strong>
                      {formatDeadlineResolution(resolvedDeadline)}
                    </strong>
                  </span>
                </>
              ) : deadlineTouched && deadlineText ? (
                <span>Try “tomorrow at 9am” or choose an exact date.</span>
              ) : (
                <span>
                  Try a day, time, weekend, or date—however you naturally say
                  it.
                </span>
              )}
              <button
                type="button"
                onClick={() => setExactDeadlineOpen((open) => !open)}
                aria-expanded={exactDeadlineOpen}
              >
                Exact date
              </button>
            </div>
            {exactDeadlineOpen && (
              <div className="sg-exact-deadline">
                <label>
                  Date
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDueDate(value);
                      setDueLabel(value ? 'Exact date' : '');
                      setDeadlineText(value);
                    }}
                  />
                </label>
                <label>
                  Time <span>optional</span>
                  <input
                    ref={editTimeRef}
                    type="time"
                    value={dueTime}
                    onChange={(event) => setDueTime(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submit(event);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          {allowSubtasks && (
            <section
              className="tm-edit-subtasks"
              aria-labelledby={`edit-subtasks-${row.id}`}
            >
              <div className="tm-edit-subtasks-heading">
                <div>
                  <strong id={`edit-subtasks-${row.id}`}>Subtasks</strong>
                  <span>Break this task into smaller steps.</span>
                </div>
                <small>{subtasks.length}/100</small>
              </div>
              {subtasks.length > 0 && (
                <div className="tm-edit-subtask-list">
                  {subtasks.map((subtask, index) => (
                    <div className="tm-edit-subtask-row" key={subtask.id}>
                      <span aria-hidden="true">{index + 1}</span>
                      <input
                        aria-label={`Subtask ${index + 1}`}
                        value={subtask.title}
                        onChange={(event) =>
                          setSubtasks((current) =>
                            current.map((item) =>
                              item.id === subtask.id
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          )
                        }
                        maxLength={160}
                        required
                      />
                      <input
                        className="tm-edit-subtask-time"
                        aria-label={`Subtask ${index + 1} time`}
                        type="time"
                        value={subtask.dueTime ?? ''}
                        onChange={(event) =>
                          setSubtasks((current) =>
                            current.map((item) =>
                              item.id === subtask.id
                                ? {
                                    ...item,
                                    dueTime: event.target.value || undefined,
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label={`Remove subtask ${subtask.title}`}
                        onClick={() =>
                          setSubtasks((current) =>
                            current.filter((item) => item.id !== subtask.id),
                          )
                        }
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="tm-edit-subtask-add">
                <BranchIcon />
                <input
                  ref={newSubtaskTitleRef}
                  aria-label="New subtask name"
                  value={newSubtaskTitle}
                  onChange={(event) => setNewSubtaskTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submit(event);
                    }
                  }}
                  placeholder="Add a smaller step"
                  maxLength={160}
                  disabled={subtasks.length >= 100}
                />
                <input
                  className="tm-edit-subtask-time"
                  aria-label="New subtask time"
                  type="time"
                  value={newSubtaskTime}
                  onChange={(event) => setNewSubtaskTime(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submit(event);
                    } else if (
                      event.key === 'Tab' &&
                      !event.shiftKey &&
                      newSubtaskTitle.trim()
                    ) {
                      event.preventDefault();
                      addSubtask();
                      requestAnimationFrame(() =>
                        newSubtaskTitleRef.current?.focus(),
                      );
                    }
                  }}
                  disabled={subtasks.length >= 100}
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  disabled={!newSubtaskTitle.trim() || subtasks.length >= 100}
                >
                  <PlusIcon />
                  <span>Add</span>
                </button>
              </div>
            </section>
          )}
          <div className="tm-edit-dialog-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save changes</button>
          </div>
        </form>
      </dialog>
    </div>,
    document.body,
  );
}

function TaskTable({
  tasks,
  onChange,
  categories,
  dayEndTime,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  categories: Record<string, CategoryMeta>;
  dayEndTime: string;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(['task-plan-week']),
  );
  const [chipOpen, setChipOpen] = useState<string | null>(null);
  const [editState, setEditState] = useState<{
    row: RowData;
    allowSubtasks: boolean;
    save: (changes: TaskEditChanges) => void;
  } | null>(null);
  const [deferState, setDeferState] = useState<{
    row: RowData;
    apply: (deadline: DeferredDeadline) => void;
  } | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const commit = (next: Task[]) => {
    onChange(next);
    void taskRepository.replace(next);
  };
  const updateTask = (id: string, updater: (task: Task) => Task) =>
    commit(
      tasks.map((task) =>
        task.id === id ? deriveTaskCompletion(updater(task)) : task,
      ),
    );
  const updateChild = (
    taskId: string,
    childId: string,
    updater: (child: Subtask) => Subtask,
  ) =>
    updateTask(taskId, (task) => ({
      ...task,
      subtasks: task.subtasks.map((child) =>
        child.id === childId ? updater(child) : child,
      ),
    }));
  const toggleExpanded = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const displayTasks = showCompleted
    ? tasks
    : tasks.filter((task) => !task.completed);
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <TooltipProvider delay={250}>
      <GlassPanel className="tm-task-table" padding="none">
        <div className="tm-table-header">
          <span>Task</span>
          <span>Work done</span>
          <span>Due</span>
          <span>Category</span>
          <span />
          <span />
        </div>
        {tasks.length ? (
          displayTasks.map((task) => {
            const parentRow: RowData = { ...task };
            return (
              <div className="tm-task-group" key={task.id}>
                <TaskGridRow
                  categories={categories}
                  row={parentRow}
                  dayEndTime={dayEndTime}
                  expanded={expanded.has(task.id)}
                  chipOpen={chipOpen === task.id}
                  onToggleExpand={() => toggleExpanded(task.id)}
                  onToggleComplete={() =>
                    updateTask(task.id, (item) => ({
                      ...item,
                      completed: !item.completed,
                      completedAt: item.completed
                        ? undefined
                        : new Date().toISOString(),
                    }))
                  }
                  onChip={() =>
                    setChipOpen((id) => (id === task.id ? null : task.id))
                  }
                  onRecordWork={(amount, unit) =>
                    updateTask(task.id, (item) =>
                      recordWork({
                        ...item,
                        progress: {
                          current:
                            (item.progress?.unit === unit
                              ? item.progress.current
                              : 0) + amount,
                          unit,
                        },
                      }),
                    )
                  }
                  onDefer={() =>
                    setDeferState({
                      row: parentRow,
                      apply: (deadline) =>
                        updateTask(task.id, (item) => ({
                          ...item,
                          ...deadline,
                        })),
                    })
                  }
                  onEdit={() =>
                    setEditState({
                      row: parentRow,
                      allowSubtasks: true,
                      save: (changes) =>
                        updateTask(task.id, (item) => ({
                          ...item,
                          ...changes,
                        })),
                    })
                  }
                  onDelete={() =>
                    commit(tasks.filter((item) => item.id !== task.id))
                  }
                  onShelf={() =>
                    updateTask(task.id, (item) => ({ ...item, shelved: true }))
                  }
                />
                {expanded.has(task.id) &&
                  task.subtasks.map((child) => {
                    const childRow: RowData = {
                      id: child.id,
                      title: child.title,
                      completed: child.completed,
                      dueDate: child.dueDate ?? task.dueDate,
                      dueTime: child.dueTime ?? task.dueTime,
                      dueLabel: child.dueLabel ?? task.dueLabel,
                      category: child.category ?? task.category,
                      progress: child.progress,
                      workLog: child.workLog,
                      subtasks: [],
                    };
                    const childKey = `${task.id}:${child.id}`;
                    return (
                      <TaskGridRow
                        key={child.id}
                        categories={categories}
                        row={childRow}
                        dayEndTime={dayEndTime}
                        depth={1}
                        chipOpen={chipOpen === childKey}
                        onToggleComplete={() =>
                          updateChild(task.id, child.id, (item) => ({
                            ...item,
                            completed: !item.completed,
                            completedAt: item.completed
                              ? undefined
                              : new Date().toISOString(),
                            progress: item.progress
                              ? {
                                  ...item.progress,
                                  current:
                                    !item.completed && item.progress.target
                                      ? item.progress.target
                                      : item.progress.current,
                                }
                              : undefined,
                          }))
                        }
                        onChip={() =>
                          setChipOpen((id) =>
                            id === childKey ? null : childKey,
                          )
                        }
                        onRecordWork={(amount, unit) =>
                          updateChild(task.id, child.id, (item) =>
                            recordWork({
                              ...item,
                              progress: {
                                current:
                                  (item.progress?.unit === unit
                                    ? item.progress.current
                                    : 0) + amount,
                                target:
                                  item.progress?.unit === unit
                                    ? item.progress.target
                                    : undefined,
                                unit,
                              },
                            }),
                          )
                        }
                        onDefer={() =>
                          setDeferState({
                            row: childRow,
                            apply: (deadline) =>
                              updateChild(task.id, child.id, (item) => ({
                                ...item,
                                ...deadline,
                              })),
                          })
                        }
                        onEdit={() =>
                          setEditState({
                            row: childRow,
                            allowSubtasks: false,
                            save: ({ subtasks: _subtasks, ...changes }) =>
                              updateChild(task.id, child.id, (item) => ({
                                ...item,
                                ...changes,
                              })),
                          })
                        }
                        onDelete={() =>
                          updateTask(task.id, (item) => ({
                            ...item,
                            subtasks: item.subtasks.filter(
                              (subtask) => subtask.id !== child.id,
                            ),
                          }))
                        }
                        onShelf={() =>
                          updateTask(task.id, (item) => ({
                            ...item,
                            subtasks: item.subtasks.filter(
                              (subtask) => subtask.id !== child.id,
                            ),
                          }))
                        }
                      />
                    );
                  })}
              </div>
            );
          })
        ) : (
          <div className="tm-empty-list">
            <CheckIcon />
            <h2>Nothing here</h2>
            <p>Add a task or adjust the current filter.</p>
          </div>
        )}
        {completedCount > 0 && (
          <button
            type="button"
            className="tm-completed-toggle"
            onClick={() => setShowCompleted((value) => !value)}
          >
            <ChevronIcon direction={showCompleted ? 'down' : 'right'} />
            <strong>Completed</strong>
            <span>{completedCount}</span>
          </button>
        )}
      </GlassPanel>
      {editState && (
        <TaskEditDialog
          row={editState.row}
          categories={categories}
          dayEndTime={dayEndTime}
          allowSubtasks={editState.allowSubtasks}
          onSave={editState.save}
          onClose={() => setEditState(null)}
        />
      )}
      {deferState && (
        <DeferTaskDialog
          row={deferState.row}
          dayEndTime={dayEndTime}
          onDefer={(deadline) => {
            deferState.apply(deadline);
            setDeferState(null);
          }}
          onClose={() => setDeferState(null)}
        />
      )}
    </TooltipProvider>
  );
}

function WorkDonePanel({
  tasks,
  dayEndTime,
}: {
  tasks: Task[];
  dayEndTime: string;
}) {
  type MonthRange = 1 | 3 | 6 | 12;
  const ranges: MonthRange[] = [1, 3, 6, 12];
  const [rangeMonths, setRangeMonths] = useState<MonthRange>(3);
  const [activityTooltip, setActivityTooltip] = useState<{
    key: string;
    date: string;
    count: number;
    summary: string;
    x: number;
    y: number;
  } | null>(null);
  const todayKey = getDayKey(new Date(), dayEndTime);
  const today = new Date(`${todayKey}T12:00:00`);
  const activityDetails = new Map<string, string[]>();
  const addActivity = (value: string | undefined, label: string) => {
    if (!value) return;
    const instant = new Date(value);
    if (Number.isNaN(instant.getTime())) return;
    const date = getDayKey(instant, dayEndTime);
    activityDetails.set(date, [...(activityDetails.get(date) ?? []), label]);
  };
  tasks.forEach((task) => {
    if (task.completed)
      addActivity(task.completedAt ?? task.createdAt, task.title);
    task.workLog?.forEach((entry) => addActivity(entry.at, task.title));
    task.subtasks.forEach((subtask) => {
      if (subtask.completed)
        addActivity(subtask.completedAt ?? task.createdAt, subtask.title);
      subtask.workLog?.forEach((entry) => addActivity(entry.at, subtask.title));
    });
  });
  const activity = new Map(
    Array.from(activityDetails, ([date, details]) => [date, details.length]),
  );

  const rangeStart = new Date(
    today.getFullYear(),
    today.getMonth() - rangeMonths + 1,
    1,
  );
  const firstDate = toDateString(rangeStart);
  const matrixDays: Array<{ date: Date; key: string; count: number }> = [];
  for (
    let cursor = new Date(rangeStart);
    cursor <= today;
    cursor = addDays(cursor, 1)
  ) {
    const key = toDateString(cursor);
    matrixDays.push({
      date: new Date(cursor),
      key,
      count: activity.get(key) ?? 0,
    });
  }
  const leadingDays = rangeStart.getDay();
  const weekCount = Math.ceil((leadingDays + matrixDays.length) / 7);
  const monthMarkers = matrixDays.flatMap((day, index) =>
    index === 0 || day.date.getDate() === 1
      ? [
          {
            key: `${day.date.getFullYear()}-${day.date.getMonth()}`,
            label: new Intl.DateTimeFormat('en', { month: 'short' }).format(
              day.date,
            ),
            year:
              day.date.getMonth() === 0 || index === 0
                ? String(day.date.getFullYear())
                : undefined,
            week: Math.floor((leadingDays + index) / 7) + 1,
          },
        ]
      : [],
  );
  const visibleActivity = Array.from(activity.entries()).filter(
    ([date]) => date >= firstDate && date <= todayKey,
  );
  const highest = Math.max(0, ...visibleActivity.map(([, count]) => count));
  const totalActivity = visibleActivity.reduce(
    (sum, [, count]) => sum + count,
    0,
  );
  const activeDays = visibleActivity.filter(([, count]) => count > 0).length;
  const busiestEntry = visibleActivity.reduce<[string, number] | undefined>(
    (best, entry) => (!best || entry[1] > best[1] ? entry : best),
    undefined,
  );
  const busiestDay =
    busiestEntry && busiestEntry[1] > 0
      ? new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
        }).format(new Date(`${busiestEntry[0]}T12:00:00`))
      : 'No activity yet';
  const showActivityTooltip = (event: ReactMouseEvent<HTMLDivElement>) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-activity-date]',
    );
    if (!cell) return;
    const key = cell.dataset.activityDate;
    if (!key) return;
    const bounds = cell.getBoundingClientRect();
    const details = activityDetails.get(key) ?? [];
    const titles = Array.from(new Set(details));
    const visibleTitles = titles.slice(0, 2).join(' · ');
    setActivityTooltip((current) =>
      current?.key === key
        ? current
        : {
            key,
            date: new Intl.DateTimeFormat('en', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }).format(new Date(`${key}T12:00:00`)),
            count: details.length,
            summary: visibleTitles
              ? `${visibleTitles}${titles.length > 2 ? ` · +${titles.length - 2}` : ''}`
              : 'No activity',
            x: Math.max(
              132,
              Math.min(window.innerWidth - 132, bounds.left + bounds.width / 2),
            ),
            y: bounds.top - 9,
          },
    );
  };
  return (
    <section className="tm-work-done-region">
      <GlassPanel className="tm-work-panel">
        <header className="tm-activity-header">
          <div className="tm-activity-title">
            <span>
              <PickaxeIcon />
            </span>
            <div>
              <h2>Work activity</h2>
              <p>
                {totalActivity} {totalActivity === 1 ? 'action' : 'actions'} in{' '}
                {rangeMonths === 1
                  ? 'this month'
                  : `the last ${rangeMonths} months`}
              </p>
            </div>
          </div>
          <fieldset className="tm-range-picker">
            <legend className="tm-visually-hidden">Activity range</legend>
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                className={rangeMonths === range ? 'active' : ''}
                aria-pressed={rangeMonths === range}
                onClick={() => setRangeMonths(range)}
              >
                {range}m
              </button>
            ))}
          </fieldset>
        </header>
        <div className="tm-activity-summary" aria-label="Activity summary">
          <div>
            <span>Actions</span>
            <strong>{totalActivity}</strong>
          </div>
          <div>
            <span>Active days</span>
            <strong>{activeDays}</strong>
          </div>
          <div className="tm-activity-busiest">
            <span>Busiest day</span>
            <strong>{busiestDay}</strong>
          </div>
        </div>
        <div
          className="tm-week-matrix-shell"
          onPointerLeave={() => setActivityTooltip(null)}
        >
          <div className="tm-weekday-labels" aria-hidden="true">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="tm-week-matrix-content">
            <div
              className="tm-week-month-axis"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
              }}
              aria-hidden="true"
            >
              {monthMarkers.map((month) => (
                <span key={month.key} style={{ gridColumnStart: month.week }}>
                  {month.label}
                  {month.year && <small>{month.year}</small>}
                </span>
              ))}
            </div>
            <div
              className="tm-week-matrix"
              onMouseMove={showActivityTooltip}
              onMouseLeave={() => setActivityTooltip(null)}
              aria-label={`Work activity over the last ${rangeMonths} ${rangeMonths === 1 ? 'month' : 'months'}`}
            >
              {Array.from({ length: leadingDays }, (_, index) => (
                <i
                  key={`leading-${index}`}
                  className="is-empty"
                  aria-hidden="true"
                />
              ))}
              {matrixDays.map(({ key, count }) => {
                const activityLevel =
                  count === 0 || highest === 0
                    ? 0
                    : Math.min(3, Math.ceil((count / highest) * 3));
                const dateLabel = new Intl.DateTimeFormat('en', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(`${key}T12:00:00`));
                const activityLabel = count
                  ? `${count} ${count === 1 ? 'action recorded' : 'actions recorded'}`
                  : 'No activity recorded';
                return (
                  <i
                    key={key}
                    className={activityLevel ? `level-${activityLevel}` : ''}
                    data-activity-date={key}
                    aria-label={`${dateLabel}: ${activityLabel}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <footer className="tm-activity-footer">
          <span>Each square is one day</span>
          <div className="tm-activity-legend" aria-hidden="true">
            <span>Less</span>
            <i />
            <i className="level-1" />
            <i className="level-2" />
            <i className="level-3" />
            <span>More</span>
          </div>
        </footer>
      </GlassPanel>
      {activityTooltip &&
        createPortal(
          <div
            className="tm-activity-tooltip-fixed"
            role="tooltip"
            style={{ left: activityTooltip.x, top: activityTooltip.y }}
          >
            <header>
              <strong>{activityTooltip.date}</strong>
              <span>
                {activityTooltip.count}{' '}
                {activityTooltip.count === 1 ? 'action' : 'actions'}
              </span>
            </header>
            <p>{activityTooltip.summary}</p>
          </div>,
          document.body,
        )}
    </section>
  );
}

function TasksPage({
  tasks,
  onChange,
  categories,
  onCategoriesChange,
  category,
  onCategoryChange,
  legacyCategoryNames,
  theme,
  onTheme,
  dayEndTime,
  onDayEndTimeChange,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  categories: Record<string, CategoryMeta>;
  onCategoriesChange: (categories: Record<string, CategoryMeta>) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  legacyCategoryNames: Record<string, string>;
  theme: Theme;
  onTheme: () => void;
  dayEndTime: string;
  onDayEndTimeChange: (time: string) => void;
}) {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [mobileAddOpen, setMobileAddOpen] = useState(false);
  const [mobileKeyboardInset, setMobileKeyboardInset] = useState(0);
  const mobileTaskInputRef = useRef<HTMLInputElement>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [categoryContextMenu, setCategoryContextMenu] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    if (!mobileAddOpen || !window.visualViewport) return;
    const viewport = window.visualViewport;
    let frame = 0;
    const updateKeyboardInset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setMobileKeyboardInset(
          Math.max(
            0,
            window.innerHeight - viewport.height - viewport.offsetTop,
          ),
        );
      });
    };
    updateKeyboardInset();
    viewport.addEventListener('resize', updateKeyboardInset);
    viewport.addEventListener('scroll', updateKeyboardInset);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', updateKeyboardInset);
      viewport.removeEventListener('scroll', updateKeyboardInset);
    };
  }, [mobileAddOpen]);
  useEffect(() => {
    if (!categoryDialogOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCategoryDialogOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [categoryDialogOpen]);
  useEffect(() => {
    const legacyNames = legacyCategoryNames;
    if (!Object.keys(legacyNames).length) return;

    window.localStorage.setItem(
      'caxius-todo.categories.v1',
      JSON.stringify(
        Object.fromEntries(
          Object.entries(categories).filter(([key]) => !categoryMeta[key]),
        ),
      ),
    );

    const nextTasks = tasks.map((task) => ({
      ...task,
      category: legacyNames[task.category] ?? task.category,
      subtasks: task.subtasks.map((subtask) => ({
        ...subtask,
        category: subtask.category
          ? (legacyNames[subtask.category] ?? subtask.category)
          : subtask.category,
      })),
    }));
    const changed = nextTasks.some(
      (task, index) =>
        task !== tasks[index] &&
        (task.category !== tasks[index].category ||
          task.subtasks.some(
            (subtask, subtaskIndex) =>
              subtask.category !== tasks[index].subtasks[subtaskIndex].category,
          )),
    );
    if (!changed) return;

    onChange(nextTasks);
    void taskRepository.replace(nextTasks);
  }, [categories, legacyCategoryNames, onChange, tasks]);
  const visible = tasks
    .filter((task) => !task.shelved)
    .filter((task) => category === 'All' || task.category === category);
  const addCategory = (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) => {
    event.preventDefault();
    const label = categoryName.trim();
    const icon = selectedIcon;
    if (!label || !icon) return;
    const name = label;
    if (categories[name]) return;
    const next = { ...categories, [name]: { icon, label } };
    onCategoriesChange(next);
    window.localStorage.setItem(
      'caxius-todo.categories.v1',
      JSON.stringify(
        Object.fromEntries(
          Object.entries(next).filter(([key]) => !categoryMeta[key]),
        ),
      ),
    );
    setCategoryDialogOpen(false);
  };
  const deleteCategory = (name: string) => {
    const label = categories[name]?.label ?? name;
    const movesToNotes = name !== '🗒️ Notes';
    if (
      !window.confirm(
        movesToNotes
          ? `Delete “${label}”? Tasks using this tag will move to Notes.`
          : `Delete “${label}”? It will be hidden from filters; existing tasks will keep their Notes label.`,
      )
    )
      return;
    const nextCategories = Object.fromEntries(
      Object.entries(categories).filter(([key]) => key !== name),
    );
    const nextTasks = tasks.map((task) => ({
      ...task,
      category:
        task.category === name && movesToNotes ? '🗒️ Notes' : task.category,
      subtasks: task.subtasks.map((subtask) => ({
        ...subtask,
        category:
          subtask.category === name && movesToNotes
            ? '🗒️ Notes'
            : subtask.category,
      })),
    }));
    if (categoryMeta[name]) {
      const deletedDefaults = readDeletedDefaultCategories();
      deletedDefaults.add(name);
      window.localStorage.setItem(
        deletedDefaultCategoriesKey,
        JSON.stringify([...deletedDefaults]),
      );
    }
    onCategoriesChange(nextCategories);
    onCategoryChange(category === name ? 'All' : category);
    window.localStorage.setItem(
      'caxius-todo.categories.v1',
      JSON.stringify(
        Object.fromEntries(
          Object.entries(nextCategories).filter(([key]) => !categoryMeta[key]),
        ),
      ),
    );
    onChange(nextTasks);
    void taskRepository.replace(nextTasks);
    setCategoryContextMenu(null);
  };
  const openCategoryDialog = () => {
    setSelectedIcon(null);
    setCategoryName('');
    setCategoryDialogOpen(true);
  };
  const createTask = (value: QuickAddValue) => {
    const subtasks: Subtask[] = value.subtasks.map((subtask) => ({
      id: makeId('subtask'),
      title: subtask.title,
      completed: false,
      dueDate: subtask.dueDate,
      dueTime: subtask.dueTime,
      dueLabel: subtask.dueLabel,
      category: value.category,
    }));
    const task: Task = {
      id: makeId('task'),
      title: value.title,
      completed: false,
      dueDate: value.dueDate,
      dueTime: value.dueTime,
      dueLabel: value.dueLabel,
      category: value.category,
      subtasks,
      createdAt: new Date().toISOString(),
    };
    const next = [task, ...tasks];
    onChange(next);
    void taskRepository.replace(next);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>(`[data-task-key="${CSS.escape(task.id)}"]`)
          ?.focus(),
      ),
    );
  };
  return (
    <div className="tm-tasks-page">
      <header className="tm-page-header">
        <div className="tm-page-title">
          <span className="tm-page-home">
            <FolderIcon />
          </span>
          <h1>Tasks</h1>
          <IconButton label="More options">
            <MoreIcon />
          </IconButton>
        </div>
        <div className="tm-view-actions">
          <DayBoundarySettings
            theme={theme}
            onTheme={onTheme}
            dayEndTime={dayEndTime}
            onDayEndTimeChange={onDayEndTimeChange}
            tasks={tasks.filter((task) => !task.shelved)}
          />
        </div>
      </header>
      <QuickAddBar
        onCreate={createTask}
        categories={Object.keys(categories)}
        dayEndTime={dayEndTime}
      />
      <Dialog
        open={mobileAddOpen}
        onOpenChange={(open) => {
          setMobileAddOpen(open);
          if (open) {
            requestAnimationFrame(() =>
              requestAnimationFrame(() => mobileTaskInputRef.current?.focus()),
            );
          }
        }}
      >
        <DialogTrigger className="tm-mobile-add-task" aria-label="Add a task">
          <span aria-hidden="true">+</span>
        </DialogTrigger>
        <DialogContent
          className="tm-mobile-add-dialog"
          style={
            {
              '--mobile-keyboard-inset': `${mobileKeyboardInset}px`,
            } as CSSProperties
          }
        >
          <DialogHeader className="tm-mobile-add-heading">
            <DialogTitle>Add a task</DialogTitle>
            <DialogDescription>
              Capture it now, then add timing, category, or subtasks if needed.
            </DialogDescription>
          </DialogHeader>
          <QuickAddBar
            inputRef={mobileTaskInputRef}
            onCreate={async (value) => {
              createTask(value);
              setMobileAddOpen(false);
            }}
            categories={Object.keys(categories)}
            dayEndTime={dayEndTime}
          />
        </DialogContent>
      </Dialog>
      <div className="tm-toolbar">
        <div className="tm-emoji-filter" aria-label="Filter tasks by category">
          <span className="tm-category-current" aria-live="polite">
            {category === 'All'
              ? 'All'
              : (categories[category]?.label ?? category)}
          </span>
          {Object.entries(categories).map(([name, meta]) => (
            <button
              key={name}
              type="button"
              className={category === name ? 'active' : ''}
              onClick={() =>
                onCategoryChange(category === name ? 'All' : name)
              }
              onContextMenu={(event) => {
                event.preventDefault();
                setCategoryContextMenu({
                  name,
                  x: event.clientX,
                  y: event.clientY,
                });
              }}
              aria-pressed={category === name}
              aria-label={`${category === name ? 'Clear filter' : 'Filter by'} ${meta.label}`}
              title={
                category === name
                  ? 'Clear category filter'
                  : `${meta.label} — right-click to delete`
              }
            >
              <CategoryIcon icon={meta.icon} />
            </button>
          ))}
          <button
            type="button"
            className="tm-add-category"
            aria-label="Add category"
            onClick={openCategoryDialog}
          >
            +
          </button>
        </div>
      </div>
      {categoryContextMenu && (
        <>
          <div
            className="tm-category-menu-backdrop"
            aria-hidden="true"
            onPointerDown={() => setCategoryContextMenu(null)}
          />
          <div
            className="tm-category-menu"
            role="menu"
            aria-label={`Actions for ${categories[categoryContextMenu.name]?.label ?? categoryContextMenu.name}`}
            style={{ left: categoryContextMenu.x, top: categoryContextMenu.y }}
          >
            <button
              type="button"
              role="menuitem"
              className="danger"
              onClick={() => deleteCategory(categoryContextMenu.name)}
            >
              <TrashIcon />
              <span>Delete tag</span>
            </button>
          </div>
        </>
      )}
      {categoryDialogOpen && (
        <div
          className="tm-category-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setCategoryDialogOpen(false);
          }}
        >
          <form className="tm-category-dialog" onSubmit={addCategory}>
            <div className="tm-category-dialog-heading">
              <div>
                <strong>Add category</strong>
                <span>Create a category for organizing tasks.</span>
              </div>
              <button
                type="button"
                onClick={() => setCategoryDialogOpen(false)}
                aria-label="Close add category dialog"
              >
                <CloseIcon />
              </button>
            </div>
            <label>
              Category name
              <input
                name="label"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="e.g. Health"
                maxLength={32}
              />
            </label>
            <div className="tm-category-icon-field">
              <span>
                Icon <em>(required)</em>
              </span>
              <Select
                value={selectedIcon}
                onValueChange={(value) => setSelectedIcon(value)}
              >
                <SelectTrigger
                  className="tm-site-select-trigger"
                  aria-label="Category icon"
                  aria-invalid={!selectedIcon}
                >
                  <span className="tm-site-select-value">
                    {selectedIcon && <CategoryIcon icon={selectedIcon} />}
                    <SelectValue placeholder="Choose an icon" />
                  </span>
                </SelectTrigger>
                <SelectContent
                  className="tm-site-select-content tm-icon-select-content"
                  align="start"
                  sideOffset={6}
                >
                  {categoryIconOptions.map(({ id, name }) => (
                    <SelectItem
                      key={id}
                      value={id}
                      className="tm-site-select-item"
                    >
                      <CategoryIcon icon={id} />
                      <span>{name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="tm-category-dialog-actions">
              <button
                type="button"
                onClick={() => setCategoryDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!categoryName.trim() || !selectedIcon}
              >
                Add category
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="tm-workspace-grid">
        <TaskTable
          categories={categories}
          tasks={visible}
          dayEndTime={dayEndTime}
          onChange={(changedVisible) => {
            const changedMap = new Map(
              changedVisible.map((task) => [task.id, task]),
            );
            const visibleIds = new Set(visible.map((task) => task.id));
            const next = tasks
              .filter(
                (task) => !visibleIds.has(task.id) || changedMap.has(task.id),
              )
              .map((task) => changedMap.get(task.id) ?? task);
            onChange(next);
          }}
        />
        <WorkDonePanel
          tasks={tasks.filter((task) => !task.shelved)}
          dayEndTime={dayEndTime}
        />
      </div>
    </div>
  );
}

function PlaceholderPage({
  view,
}: {
  view: Exclude<View, 'tasks' | 'style-guide'>;
}) {
  return (
    <section className="tm-placeholder">
      <div>
        <NavIcon view={view} />
      </div>
      <p>{view}</p>
      <h1>
        {view === 'timeline'
          ? 'Timeline view'
          : view[0].toUpperCase() + view.slice(1)}
      </h1>
      <span>
        This area stays intentionally simple until the task workflow is settled.
      </span>
    </section>
  );
}

function ShelfPage({
  tasks,
  onChange,
  dayEndTime,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  dayEndTime: string;
}) {
  const shelvedTasks = tasks.filter((task) => task.shelved);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editorCategories] = useState(() => loadCategoryConfig().categories);
  const restore = (id: string) => {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, shelved: false } : task,
    );
    onChange(next);
    void taskRepository.replace(next);
  };
  const remove = (id: string) => {
    const next = tasks.filter((task) => task.id !== id);
    onChange(next);
    void taskRepository.replace(next);
  };

  return (
    <section className="tm-shelf-page" aria-labelledby="shelf-title">
      <header className="tm-page-header tm-shelf-header">
        <div className="tm-page-title">
          <span className="tm-page-home">
            <ArchiveIcon />
          </span>
          <div>
            <p>Later</p>
            <h1 id="shelf-title">Shelf</h1>
            <small>Tasks you’ve put aside without losing them.</small>
          </div>
        </div>
        {shelvedTasks.length > 0 && (
          <strong>
            {shelvedTasks.length} {shelvedTasks.length === 1 ? 'task' : 'tasks'}
          </strong>
        )}
      </header>
      {shelvedTasks.length ? (
        <div className="tm-shelf-list">
          {shelvedTasks.map((task) => {
            const due = dueDisplay(
              task.dueDate,
              task.dueTime,
              task.dueLabel,
              dayEndTime,
            );
            const category = categoryMeta[task.category] ?? {
              icon: '🏷️',
              label: task.category,
            };
            return (
              <article
                className="tm-shelf-item"
                key={task.id}
                data-keyboard-task-row
              >
                <div className="tm-shelf-item-main">
                  <h2>
                    <button
                      type="button"
                      className="tm-keyboard-task-title"
                      data-keyboard-task
                      data-task-key={task.id}
                      aria-keyshortcuts="E"
                      onClick={() => setEditTask(task)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') event.preventDefault();
                        if (event.key.toLowerCase() === 'e') {
                          event.preventDefault();
                          setEditTask(task);
                        }
                      }}
                    >
                      {task.title}
                    </button>
                  </h2>
                  <p>
                    <span title={category.label}>
                      <CategoryIcon icon={category.icon} />
                      {category.label}
                    </span>
                    {task.subtasks.length > 0 && (
                      <span>{formatWorkDone(task)}</span>
                    )}
                    {task.dueDate && (
                      <time className={due.state} title={due.tooltip}>
                        {due.label}
                      </time>
                    )}
                  </p>
                </div>
                <div className="tm-shelf-actions">
                  <button
                    type="button"
                    className="tm-shelf-restore"
                    onClick={() => restore(task.id)}
                  >
                    Restore
                  </button>
                  <IconButton
                    label={`Delete ${task.title} permanently`}
                    size="small"
                    className="tm-shelf-delete"
                    onClick={() => remove(task.id)}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="tm-shelf-empty">
          <ArchiveIcon />
          <h2>Your shelf is clear</h2>
          <p>
            Set tasks aside from the task list whenever you need more room to
            focus.
          </p>
        </div>
      )}
      {editTask && (
        <TaskEditDialog
          row={editTask}
          categories={editorCategories}
          dayEndTime={dayEndTime}
          allowSubtasks
          onSave={(changes) => {
            const next = tasks.map((task) =>
              task.id === editTask.id ? { ...task, ...changes } : task,
            );
            onChange(next);
            void taskRepository.replace(next);
          }}
          onClose={() => setEditTask(null)}
        />
      )}
    </section>
  );
}

type TimelineGroup = {
  id: string;
  label: string;
  description?: string;
  tasks: Task[];
};

function TimelinePage({
  tasks,
  onChange,
  categories,
  category,
  onCategoryChange,
  dayEndTime,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  categories: Record<string, CategoryMeta>;
  category: string;
  onCategoryChange: (category: string) => void;
  dayEndTime: string;
}) {
  const [deferTask, setDeferTask] = useState<Task | null>(null);
  const [chipTask, setChipTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(
    () => new Set(),
  );
  const now = new Date();
  const today = new Date(`${getDayKey(now, dayEndTime)}T12:00:00`);
  const todayKey = toDateString(today);
  const tomorrowKey = toDateString(addDays(today, 1));
  const fewDaysEnd = toDateString(addDays(today, 3));
  const thisSunday = toDateString(addDays(today, 7 - today.getDay()));
  const nextMonday = toDateString(addDays(today, 8 - today.getDay()));
  const nextSunday = toDateString(addDays(today, 14 - today.getDay()));
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const monthEndKey = toDateString(monthEnd);
  const yearEndKey = `${today.getFullYear()}-12-31`;
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  const groups: TimelineGroup[] = [
    {
      id: 'earlier',
      label: 'Earlier',
      description: 'Past due and still open',
      tasks: [],
    },
    {
      id: 'today',
      label: 'Today',
      description: 'What needs your attention now',
      tasks: [],
    },
    ...(isWeekend
      ? [
          {
            id: 'weekend',
            label: 'This weekend',
            description: 'Before the week resets',
            tasks: [],
          },
        ]
      : []),
    {
      id: 'few-days',
      label: 'Next few days',
      description: 'Coming up soon',
      tasks: [],
    },
    {
      id: 'this-week',
      label: 'This week',
      description: 'Before Sunday',
      tasks: [],
    },
    {
      id: 'next-week',
      label: 'Next week',
      description: 'The week ahead',
      tasks: [],
    },
    {
      id: 'this-month',
      label: 'This month',
      description: 'Later this month',
      tasks: [],
    },
    {
      id: 'this-year',
      label: 'This year',
      description: 'Further ahead',
      tasks: [],
    },
  ];

  const groupFor = (dueDate: string) => {
    if (dueDate < todayKey) return 'earlier';
    if (dueDate === todayKey) return 'today';
    if (isWeekend && dueDate <= thisSunday) return 'weekend';
    if (dueDate >= tomorrowKey && dueDate <= fewDaysEnd) return 'few-days';
    if (dueDate <= thisSunday) return 'this-week';
    if (dueDate >= nextMonday && dueDate <= nextSunday) return 'next-week';
    if (dueDate <= monthEndKey) return 'this-month';
    if (dueDate <= yearEndKey) return 'this-year';
    return undefined;
  };

  const plannedTasks = tasks.filter(
    (task) =>
      !task.shelved &&
      !task.completed &&
      task.dueDate &&
      groupFor(task.dueDate),
  );
  const categoryFor = (name: string) => {
    if (categories[name]) return categories[name];
    const [icon, ...labelParts] = name.split(' ');
    if (categoryIconById.has(icon) && labelParts.length) {
      return { icon, label: labelParts.join(' ') };
    }
    return { icon: 'tags', label: name };
  };
  const filteredTasks = plannedTasks.filter(
    (task) => category === 'All' || task.category === category,
  );
  const dueNowCount = plannedTasks.filter(
    (task) => task.dueDate && task.dueDate <= todayKey,
  ).length;

  filteredTasks
    .sort((left, right) =>
      `${left.dueDate}-${left.dueTime ?? '99:99'}`.localeCompare(
        `${right.dueDate}-${right.dueTime ?? '99:99'}`,
      ),
    )
    .forEach((task) => {
      const group = groups.find((item) => item.id === groupFor(task.dueDate!));
      group?.tasks.push(task);
    });

  const visibleGroups = groups.filter((group) => group.tasks.length > 0);
  const toggleComplete = (task: Task) => {
    const next = tasks.map((item) =>
      item.id === task.id
        ? { ...item, completed: true, completedAt: new Date().toISOString() }
        : item,
    );
    onChange(next);
    void taskRepository.replace(next);
  };
  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((current) => {
      const next = new Set(current);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };
  const toggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    const next = tasks.map((task) =>
      task.id === taskId
        ? deriveTaskCompletion({
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    completed: !subtask.completed,
                    completedAt: subtask.completed
                      ? undefined
                      : new Date().toISOString(),
                  }
                : subtask,
            ),
          })
        : task,
    );
    onChange(next);
    void taskRepository.replace(next);
  };
  const defer = (deadline: DeferredDeadline) => {
    if (!deferTask) return;
    const next = tasks.map((task) =>
      task.id === deferTask.id ? { ...task, ...deadline } : task,
    );
    onChange(next);
    void taskRepository.replace(next);
    setDeferTask(null);
  };
  const logWork = (task: Task, amount: number, unit: ProgressUnit) => {
    const next = tasks.map((item) =>
      item.id === task.id
        ? recordWork({
            ...item,
            progress: {
              current:
                (item.progress?.unit === unit ? item.progress.current : 0) +
                amount,
              unit,
            },
          })
        : item,
    );
    onChange(next);
    void taskRepository.replace(next);
  };

  return (
    <section className="tm-timeline-page" aria-labelledby="timeline-title">
      <header className="tm-page-header tm-timeline-header">
        <div className="tm-page-title">
          <span className="tm-page-home">
            <TimelineIcon />
          </span>
          <div>
            <p>Plan</p>
            <h1 id="timeline-title">Timeline</h1>
            <p className="tm-timeline-intro">
              See what matters now, then what comes next.
            </p>
          </div>
        </div>
        <div className="tm-timeline-summary" aria-label="Timeline summary">
          <div>
            <strong>{plannedTasks.length}</strong>
            <span>Planned</span>
          </div>
          <div className={dueNowCount ? 'attention' : ''}>
            <strong>{dueNowCount}</strong>
            <span>Due now</span>
          </div>
        </div>
      </header>
      <div className="tm-timeline-filters" aria-label="Filter timeline tasks">
        <span>Categories</span>
        <fieldset>
          <legend>Filter timeline by category</legend>
          <button
            type="button"
            className={category === 'All' ? 'active' : ''}
            aria-pressed={category === 'All'}
            onClick={() => onCategoryChange('All')}
          >
            <span>All</span>
            <small>{plannedTasks.length}</small>
          </button>
          {Object.entries(categories).map(([name, meta]) => {
            const count = plannedTasks.filter(
              (task) => task.category === name,
            ).length;
            return (
              <button
                type="button"
                key={name}
                className={category === name ? 'active' : ''}
                aria-pressed={category === name}
                onClick={() =>
                  onCategoryChange(category === name ? 'All' : name)
                }
              >
                <CategoryIcon icon={meta.icon} />
                <span>{meta.label}</span>
                <small>{count}</small>
              </button>
            );
          })}
        </fieldset>
      </div>
      {visibleGroups.length ? (
        <div className="tm-timeline-groups">
          {visibleGroups.map((group) => (
            <section
              className="tm-timeline-group"
              key={group.id}
              aria-labelledby={`timeline-${group.id}`}
            >
              <header>
                <div>
                  <h2 id={`timeline-${group.id}`}>{group.label}</h2>
                  {group.description && <p>{group.description}</p>}
                </div>
                <span>{group.tasks.length}</span>
              </header>
              <div className="tm-timeline-items">
                {group.tasks.map((task) => {
                  const due = dueDisplay(
                    task.dueDate,
                    task.dueTime,
                    task.dueLabel,
                    dayEndTime,
                  );
                  const category = categoryFor(task.category);
                  const loggedWorkSessions = Math.max(
                    task.workLog?.length ?? 0,
                    task.progress && task.progress.current > 0 ? 1 : 0,
                  );
                  const workLevel =
                    task.subtasks.length === 0 && loggedWorkSessions
                      ? Math.min(9, 4 + loggedWorkSessions)
                      : 0;
                  const isExpanded = expandedTasks.has(task.id);
                  return (
                    <Fragment key={task.id}>
                      <article
                        className="tm-timeline-item"
                        data-keyboard-task-row
                      >
                        <div className="tm-title-cell">
                          <CompletionCircle
                            checked={false}
                            workLevel={workLevel}
                            label={`Mark ${task.title} complete`}
                            onChange={() => toggleComplete(task)}
                          />
                          {task.subtasks.length > 0 && (
                            <button
                              type="button"
                              className="tm-expand-button tm-timeline-expand-button"
                              onClick={() => toggleExpanded(task.id)}
                              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} subtasks for ${task.title}`}
                              aria-expanded={isExpanded}
                              aria-controls={`timeline-subtasks-${task.id}`}
                            >
                              <ChevronIcon
                                direction={isExpanded ? 'down' : 'right'}
                              />
                            </button>
                          )}
                          <h3>
                            <button
                              type="button"
                              className="tm-keyboard-task-title"
                              data-keyboard-task
                              data-task-key={task.id}
                              aria-keyshortcuts="E"
                              onClick={() => setEditTask(task)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter')
                                  event.preventDefault();
                                if (event.key.toLowerCase() === 'e') {
                                  event.preventDefault();
                                  setEditTask(task);
                                }
                              }}
                            >
                              {task.title}
                            </button>
                          </h3>
                        </div>
                        <WorkDoneCell
                          row={task}
                          onChip={() => setChipTask(task)}
                        />
                        <div className={`tm-due-cell ${due.state}`}>
                          {due.state === 'overdue' ? (
                            <WarningIcon />
                          ) : (
                            <CalendarIcon />
                          )}
                          <time>{due.label}</time>
                        </div>
                        <div
                          className="tm-category-cell"
                          title={category.label}
                          aria-label={category.label}
                        >
                          <CategoryIcon icon={category.icon} />
                        </div>
                        <IconButton
                          label={`Defer ${task.title}`}
                          size="small"
                          className="tm-timeline-defer-button"
                          onClick={() => setDeferTask(task)}
                        >
                          <DeferIcon />
                        </IconButton>
                      </article>
                      {isExpanded && (
                        <div
                          className="tm-timeline-subtasks"
                          id={`timeline-subtasks-${task.id}`}
                        >
                          {task.subtasks.map((subtask) => {
                            const subtaskRow: RowData = {
                              id: subtask.id,
                              title: subtask.title,
                              completed: subtask.completed,
                              dueDate: subtask.dueDate ?? task.dueDate,
                              dueTime: subtask.dueTime ?? task.dueTime,
                              dueLabel: subtask.dueLabel ?? task.dueLabel,
                              category: subtask.category ?? task.category,
                              progress: subtask.progress,
                              workLog: subtask.workLog,
                              subtasks: [],
                            };
                            const subtaskDue = dueDisplay(
                              subtaskRow.dueDate,
                              subtaskRow.dueTime,
                              subtaskRow.dueLabel,
                              dayEndTime,
                            );
                            const subtaskCategory = categoryFor(
                              subtaskRow.category,
                            );
                            return (
                              <article
                                className={`tm-timeline-item tm-timeline-subtask${subtask.completed ? ' completed' : ''}`}
                                key={subtask.id}
                              >
                                <div className="tm-title-cell">
                                  <CompletionCircle
                                    checked={subtask.completed}
                                    label={`Mark ${subtask.title} ${subtask.completed ? 'incomplete' : 'complete'}`}
                                    onChange={() =>
                                      toggleSubtaskComplete(task.id, subtask.id)
                                    }
                                  />
                                  <h3>
                                    <button
                                      type="button"
                                      className="tm-keyboard-task-title"
                                      onClick={() => setEditTask(task)}
                                    >
                                      {subtask.title}
                                    </button>
                                  </h3>
                                </div>
                                <div className="tm-work-cell">
                                  <output
                                    className={
                                      subtask.completed ? 'complete' : ''
                                    }
                                  >
                                    {formatWorkDone(subtaskRow)}
                                  </output>
                                </div>
                                <div
                                  className={`tm-due-cell ${subtaskDue.state}`}
                                >
                                  {subtaskDue.state === 'overdue' ? (
                                    <WarningIcon />
                                  ) : (
                                    <CalendarIcon />
                                  )}
                                  <time>{subtaskDue.label}</time>
                                </div>
                                <div
                                  className="tm-category-cell"
                                  title={subtaskCategory.label}
                                  aria-label={subtaskCategory.label}
                                >
                                  <CategoryIcon icon={subtaskCategory.icon} />
                                </div>
                                <span aria-hidden="true" />
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="tm-timeline-empty">
          <TimelineIcon />
          <h2>
            {plannedTasks.length
              ? 'No tasks match this filter'
              : 'Nothing is on your timeline yet'}
          </h2>
          <p>
            {plannedTasks.length
              ? 'Choose another category or return to all planned tasks.'
              : 'Tasks with a due date will appear here when they matter.'}
          </p>
          {plannedTasks.length > 0 && (
            <button type="button" onClick={() => onCategoryChange('All')}>
              Clear filter
            </button>
          )}
        </div>
      )}
      {deferTask && (
        <DeferTaskDialog
          row={deferTask}
          dayEndTime={dayEndTime}
          onDefer={defer}
          onClose={() => setDeferTask(null)}
        />
      )}
      {chipTask && (
        <ChipAwayDialog
          row={chipTask}
          onRecord={(amount, unit) => logWork(chipTask, amount, unit)}
          onClose={() => setChipTask(null)}
        />
      )}
      {editTask && (
        <TaskEditDialog
          row={editTask}
          categories={categories}
          dayEndTime={dayEndTime}
          allowSubtasks
          onSave={(changes) => {
            const next = tasks.map((task) =>
              task.id === editTask.id ? { ...task, ...changes } : task,
            );
            onChange(next);
            void taskRepository.replace(next);
          }}
          onClose={() => setEditTask(null)}
        />
      )}
    </section>
  );
}

export default function Home() {
  const [view, setView] = useState<View>('tasks');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const taskHistory = useRef<Task[][]>([]);
  const lastSelectedTask = useRef<Partial<Record<View, string>>>({});
  const pendingViewFocus = useRef(false);
  const pendingQuickAddFocus = useRef(false);
  const [undoCount, setUndoCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');
  const [dayEndTime, setDayEndTime] = useState(DEFAULT_DAY_END_TIME);
  const [initialCategoryConfig] = useState(loadCategoryConfig);
  const [categories, setCategories] = useState<Record<string, CategoryMeta>>(
    initialCategoryConfig.categories,
  );
  const [category, setCategory] = useState('All');
  useEffect(() => {
    let active = true;
    void taskRepository
      .list()
      .then((items) => {
        if (active) setTasks(items.map(deriveTaskCompletion));
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'TÆLOS could not load your tasks.',
          );
        }
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const saved = window.localStorage.getItem('todo-theme');
    if (saved !== 'dark' && saved !== 'light') return;
    const frame = window.requestAnimationFrame(() => setTheme(saved));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const saved = window.localStorage.getItem('caxius-todo.day-end-time.v1');
    if (!saved) return;
    const frame = window.requestAnimationFrame(() =>
      setDayEndTime(normalizeDayEndTime(saved)),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const toggleTheme = () =>
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('todo-theme', next);
      return next;
    });
  const updateDayEndTime = (value: string) => {
    const next = normalizeDayEndTime(value);
    setDayEndTime(next);
    window.localStorage.setItem('caxius-todo.day-end-time.v1', next);
  };
  const commitTasks = (next: Task[]) => {
    taskHistory.current.push(structuredClone(tasks));
    if (taskHistory.current.length > 50) taskHistory.current.shift();
    setUndoCount(taskHistory.current.length);
    setTasks(next);
  };
  const undoLastChange = () => {
    const previous = taskHistory.current.pop();
    if (!previous) return;
    setUndoCount(taskHistory.current.length);
    setTasks(previous);
    void taskRepository.replace(previous);
  };
  useEffect(() => {
    const handleUndoShortcut = (event: KeyboardEvent) => {
      if ((!event.metaKey && !event.ctrlKey) || event.key.toLowerCase() !== 'z')
        return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.closest('input, textarea, select, [contenteditable="true"]')
      )
        return;
      if (!taskHistory.current.length) return;
      event.preventDefault();
      undoLastChange();
    };
    window.addEventListener('keydown', handleUndoShortcut);
    return () => window.removeEventListener('keydown', handleUndoShortcut);
  });
  useEffect(() => {
    const rememberSelection = (event: FocusEvent) => {
      const row = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-keyboard-task]',
      );
      if (row?.dataset.taskKey)
        lastSelectedTask.current[view] = row.dataset.taskKey;
    };
    window.addEventListener('focusin', rememberSelection);
    return () => window.removeEventListener('focusin', rememberSelection);
  }, [view]);
  useEffect(() => {
    if (!pendingViewFocus.current && !pendingQuickAddFocus.current) return;
    const frame = window.requestAnimationFrame(() => {
      if (pendingQuickAddFocus.current && view === 'tasks') {
        pendingQuickAddFocus.current = false;
        document
          .querySelector<HTMLInputElement>('[data-quick-add-title]')
          ?.focus();
        return;
      }
      if (!pendingViewFocus.current) return;
      pendingViewFocus.current = false;
      const remembered = lastSelectedTask.current[view];
      const rows = Array.from(
        document.querySelectorAll<HTMLElement>('.tm-main [data-keyboard-task]'),
      );
      (
        rows.find((row) => row.dataset.taskKey === remembered) ?? rows[0]
      )?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view, loaded]);
  useEffect(() => {
    const handleBrowseShortcut = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(
        target?.isContentEditable ||
        target?.closest('input, textarea, select, [contenteditable="true"]'),
      );
      if (isTyping || document.querySelector('[aria-modal="true"]')) return;

      const nextView =
        event.key === '1'
          ? 'tasks'
          : event.key === '2'
            ? 'timeline'
            : event.key === '3'
              ? 'shelf'
              : null;
      if (nextView) {
        event.preventDefault();
        pendingViewFocus.current = true;
        if (nextView === view) {
          pendingViewFocus.current = false;
          const remembered = lastSelectedTask.current[view];
          const rows = Array.from(
            document.querySelectorAll<HTMLElement>(
              '.tm-main [data-keyboard-task]',
            ),
          );
          (
            rows.find((row) => row.dataset.taskKey === remembered) ?? rows[0]
          )?.focus();
        } else {
          setView(nextView);
        }
        return;
      }
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        pendingQuickAddFocus.current = true;
        if (view !== 'tasks') setView('tasks');
        else {
          pendingQuickAddFocus.current = false;
          document
            .querySelector<HTMLInputElement>('[data-quick-add-title]')
            ?.focus();
        }
        return;
      }
      if (event.key === '?') {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (event.key === 'Escape') {
        const selectedTask = target?.closest<HTMLElement>(
          '[data-keyboard-task]',
        );
        if (selectedTask) {
          event.preventDefault();
          selectedTask.blur();
        }
        return;
      }

      const rows = Array.from(
        document.querySelectorAll<HTMLElement>('.tm-main [data-keyboard-task]'),
      );
      if (!rows.length) return;
      const current = target?.closest<HTMLElement>('[data-keyboard-task]');
      const currentIndex = current ? rows.indexOf(current) : -1;
      if (event.key.toLowerCase() === 'j' || event.key === 'ArrowDown') {
        event.preventDefault();
        rows[Math.min(currentIndex + 1, rows.length - 1)]?.focus();
      } else if (event.key.toLowerCase() === 'k' || event.key === 'ArrowUp') {
        event.preventDefault();
        rows[
          currentIndex < 0 ? rows.length - 1 : Math.max(currentIndex - 1, 0)
        ]?.focus();
      } else if (event.key === ' ' && current) {
        const completion = current
          .closest<HTMLElement>('[data-keyboard-task-row]')
          ?.querySelector<HTMLInputElement>('[data-keyboard-complete]');
        if (completion) {
          event.preventDefault();
          completion.click();
          current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleBrowseShortcut);
    return () => window.removeEventListener('keydown', handleBrowseShortcut);
  }, [view]);
  if (view === 'style-guide')
    return (
      <div className="app-style-route todo-style-guide">
        <button
          type="button"
          className="app-back-to-product"
          onClick={() => setView('tasks')}
        >
          <ChevronIcon direction="left" /> Back to product
        </button>
        <TodoStyleGuide />
      </div>
    );
  return (
    <main className={`tm-app tm-theme-${theme} todo-style-guide`}>
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="tm-shortcuts-dialog">
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription>
              Move through TÆLOS and act on tasks without leaving the keyboard.
            </DialogDescription>
          </DialogHeader>
          <div className="tm-shortcut-groups">
            <section>
              <h2>Navigate</h2>
              <dl>
                <div>
                  <dt>
                    <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>
                  </dt>
                  <dd>Tasks, Timeline, Shelf</dd>
                </div>
                <div>
                  <dt>
                    <kbd>J</kbd> <kbd>K</kbd>
                  </dt>
                  <dd>Next or previous task</dd>
                </div>
                <div>
                  <dt>
                    <kbd>↑</kbd> <kbd>↓</kbd>
                  </dt>
                  <dd>Next or previous task</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2>Tasks</h2>
              <dl>
                <div>
                  <dt>
                    <kbd>N</kbd>
                  </dt>
                  <dd>Add a task</dd>
                </div>
                <div>
                  <dt>
                    <kbd>Enter</kbd>
                  </dt>
                  <dd>Expand or collapse subtasks</dd>
                </div>
                <div>
                  <dt>
                    <kbd>E</kbd>
                  </dt>
                  <dd>Edit the selected task</dd>
                </div>
                <div>
                  <dt>
                    <kbd>Space</kbd>
                  </dt>
                  <dd>Complete the selected task</dd>
                </div>
                <div>
                  <dt>
                    <kbd>Esc</kbd>
                  </dt>
                  <dd>Leave row navigation</dd>
                </div>
                <div>
                  <dt>
                    <kbd>⌘/Ctrl</kbd> <kbd>Z</kbd>
                  </dt>
                  <dd>Undo the last change</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2>Create and edit</h2>
              <dl>
                <div>
                  <dt>
                    <kbd>Enter</kbd>
                  </dt>
                  <dd>Finish and save</dd>
                </div>
                <div>
                  <dt>
                    <kbd>Tab</kbd>
                  </dt>
                  <dd>Add another detail</dd>
                </div>
                <div>
                  <dt>
                    <kbd>Shift</kbd> <kbd>Tab</kbd>
                  </dt>
                  <dd>Move to the previous detail</dd>
                </div>
                <div>
                  <dt>
                    <kbd>Esc</kbd>
                  </dt>
                  <dd>Close or cancel</dd>
                </div>
              </dl>
            </section>
          </div>
          <p className="tm-shortcuts-footnote">
            Shortcuts pause while you are typing. Press <kbd>?</kbd> anytime in
            browse mode to reopen this guide.
          </p>
        </DialogContent>
      </Dialog>
      <Navigation
        view={view}
        activeCount={tasks.filter((task) => !task.completed).length}
        collapsed={sidebarCollapsed}
        onView={setView}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={`tm-main${sidebarCollapsed ? ' tm-main-sidebar-collapsed' : ''}`}
      >
        {!loaded ? (
          <output className="tm-loading">
            <BrandMark />
            Loading tasks…
          </output>
        ) : loadError ? (
          <output className="tm-loading tm-load-error">
            <BrandMark />
            <strong>We couldn’t load your tasks.</strong>
            <span>{loadError}</span>
          </output>
        ) : view === 'tasks' ? (
          <TasksPage
            tasks={tasks}
            onChange={commitTasks}
            categories={categories}
            onCategoriesChange={setCategories}
            category={category}
            onCategoryChange={setCategory}
            legacyCategoryNames={initialCategoryConfig.legacyNames}
            theme={theme}
            onTheme={toggleTheme}
            dayEndTime={dayEndTime}
            onDayEndTimeChange={updateDayEndTime}
          />
        ) : view === 'timeline' ? (
          <TimelinePage
            tasks={tasks}
            onChange={commitTasks}
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            dayEndTime={dayEndTime}
          />
        ) : view === 'shelf' ? (
          <ShelfPage
            tasks={tasks}
            onChange={commitTasks}
            dayEndTime={dayEndTime}
          />
        ) : (
          <PlaceholderPage view={view} />
        )}
      </div>
      {undoCount > 0 && (
        <output className="tm-undo-toast" aria-live="polite">
          <span>Last task change</span>
          <button
            type="button"
            onClick={undoLastChange}
            aria-label="Undo last task change"
          >
            Undo
          </button>
        </output>
      )}
    </main>
  );
}

function ChevronIcon({ direction }: { direction: 'right' | 'down' | 'left' }) {
  const path =
    direction === 'right'
      ? 'm8 5 5 5-5 5'
      : direction === 'down'
        ? 'm5 8 5 5 5-5'
        : 'm12 5-5 5 5 5';
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
function PickaxeIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m7 4 8 8M12 3l5 5M4 17l7-7M3 4c3-2 6-2 9 0l-2 2c-2-1-4-1-6 0Z" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4 14-.5 3 3-.5L16 7l-3-3Z" />
      <path d="m11.5 5.5 3 3" />
    </svg>
  );
}
function DeferIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M8 6l-4 4 4 4" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3 2.5 17h15Z" />
      <path d="M10 7v5M10 14.5v.2" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m6 6 8 8M14 6l-8 8" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16.5 12.8A7 7 0 0 1 7.2 3.5 7 7 0 1 0 16.5 12.8Z" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2.5 5.5h6l1.5 2h7.5v8.5h-15z" />
    </svg>
  );
}
function RepeatIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 7a6 6 0 0 1 10-2l2 2M16 4v3h-3M16 13a6 6 0 0 1-10 2l-2-2M4 16v-3h3" />
    </svg>
  );
}
function PaletteIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3a7 7 0 1 0 0 14h1.5a1.5 1.5 0 0 0 0-3H10a1.5 1.5 0 0 1 0-3h3a4 4 0 0 0 4-4c0-2.2-3.1-4-7-4Z" />
      <circle cx="6.5" cy="7" r=".6" />
      <circle cx="9.5" cy="5.5" r=".6" />
      <circle cx="13" cy="6.5" r=".6" />
    </svg>
  );
}
