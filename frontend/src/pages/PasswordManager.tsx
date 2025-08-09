"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  Plus,
  Shield,
  Key,
  Globe,
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Wallet,
  Lock,
  Zap,
  Star,
  Settings,
  LogOut,
  Grid3X3,
  X,
  Edit,
  Trash2,
  Heart,
} from "lucide-react";
import logo from "../assets/logo.jpg";
import Connect from "../wallet/Connects";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export default function Component() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const PLATFORM_ADDRESS =
    (import.meta.env.VITE_SUPPORT_ADDRESS as string) || "";
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportAmount, setSupportAmount] = useState("0.1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openTagDropdown, setOpenTagDropdown] = useState<string | null>(null);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newPasswordData, setNewPasswordData] = useState({
    name: "",
    username: "",
    password: "",
    url: "",
    category: "",
    tags: [] as string[],
    notes: "",
  });
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState({ id: "", content: "" });
  const [showPasswordGeneratorModal, setShowPasswordGeneratorModal] =
    useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordOptions, setPasswordOptions] = useState({
    length: 16,
    alphabets: 8,
    numbers: 4,
    symbols: 4,
    complexity: "medium",
    useRandom: false,
  });

  const passwords = [
    {
      id: "1",
      name: "MetaMask Wallet",
      username: "0x742d35Cc6634C0532925a3b8D404fddF4f",
      password: "SecurePass123!",
      url: "https://metamask.io",
      category: "Web3",
      tags: ["DeFi"],
      favicon: "🦊",
      lastUsed: "2 hours ago",
      strength: "Strong",
      isFavorite: true,
      notes:
        "Main wallet for DeFi transactions. Recovery phrase stored in hardware wallet.",
    },
    {
      id: "2",
      name: "OpenSea",
      username: "cryptouser@email.com",
      password: "NFTCollector2024",
      url: "https://opensea.io",
      category: "Web3",
      tags: ["NFT", "Marketplace", "Web3"],
      favicon: "🌊",
      lastUsed: "1 day ago",
      strength: "Medium",
      isFavorite: false,
      notes: "Connected to MetaMask wallet. Used for buying and selling NFTs.",
    },
    {
      id: "3",
      name: "Gmail",
      username: "user@gmail.com",
      password: "EmailPass456!",
      url: "https://gmail.com",
      category: "Email",
      tags: [],
      favicon: "📧",
      lastUsed: "3 hours ago",
      strength: "Strong",
      isFavorite: true,
      notes:
        "Primary email account. 2FA enabled with phone number +1-555-0123.",
    },
    {
      id: "4",
      name: "Uniswap",
      username: "0x8ba1f109551bD432803012645Hac136c",
      password: "DeFiTrader789",
      url: "https://uniswap.org",
      category: "Web3",
      tags: ["DeFi", "Trading", "AMM", "Ethereum", "Swap", "Liquidity"],
      favicon: "🦄",
      lastUsed: "5 hours ago",
      strength: "Medium",
      isFavorite: false,
      notes:
        "DEX for token swapping. Liquidity pool: ETH/USDC. Slippage tolerance: 0.5%",
    },
  ];

  const [categories, setCategories] = useState([
    {
      value: "all",
      label: "All Items",
      count: 4,
      icon: "📁",
      color: "bg-gray-100",
    },
    {
      value: "web3",
      label: "Web3",
      count: 3,
      icon: "🌐",
      color: "bg-blue-100",
    },
    {
      value: "email",
      label: "Email",
      count: 1,
      icon: "📧",
      color: "bg-green-100",
    },
    {
      value: "social",
      label: "Social",
      count: 0,
      icon: "👥",
      color: "bg-purple-100",
    },
    {
      value: "work",
      label: "Work",
      count: 0,
      icon: "💼",
      color: "bg-orange-100",
    },
    {
      value: "finance",
      label: "Finance",
      count: 0,
      icon: "💰",
      color: "bg-yellow-100",
    },
    {
      value: "shopping",
      label: "Shopping",
      count: 0,
      icon: "🛒",
      color: "bg-pink-100",
    },
    {
      value: "entertainment",
      label: "Entertainment",
      count: 0,
      icon: "🎬",
      color: "bg-red-100",
    },
    {
      value: "gaming",
      label: "Gaming",
      count: 0,
      icon: "🎮",
      color: "bg-indigo-100",
    },
    {
      value: "education",
      label: "Education",
      count: 0,
      icon: "📚",
      color: "bg-teal-100",
    },
    {
      value: "health",
      label: "Health",
      count: 0,
      icon: "🏥",
      color: "bg-emerald-100",
    },
    {
      value: "travel",
      label: "Travel",
      count: 0,
      icon: "✈️",
      color: "bg-cyan-100",
    },
    {
      value: "news",
      label: "News",
      count: 0,
      icon: "📰",
      color: "bg-slate-100",
    },
    {
      value: "utilities",
      label: "Utilities",
      count: 0,
      icon: "⚡",
      color: "bg-amber-100",
    },
    {
      value: "government",
      label: "Government",
      count: 0,
      icon: "🏛️",
      color: "bg-stone-100",
    },
    {
      value: "personal",
      label: "Personal",
      count: 0,
      icon: "👤",
      color: "bg-rose-100",
    },
  ]);

  const availableTags = [
    "DeFi",
    "Wallet",
    "Ethereum",
    "NFT",
    "Marketplace",
    "Web3",
    "Email",
    "Google",
    "Personal",
    "Trading",
    "AMM",
    "Social",
    "Work",
    "Finance",
    "Swap",
    "Liquidity",
  ];

  const filteredPasswords = passwords.filter((password) => {
    const matchesSearch =
      password.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      password.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesFavorites = !showFavorites || password.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sendSupport = async () => {
    if (!account?.address) {
      alert("Please connect a Sui wallet first.");
      return;
    }
    if (!PLATFORM_ADDRESS) {
      alert("Missing VITE_SUPPORT_ADDRESS in .env.");
      return;
    }
    try {
      setIsSendingSupport(true);
      const txb = new Transaction();
      const amountMisto = BigInt(
        Math.floor(Number(supportAmount) * 1_000_000_000)
      );
      const [coin] = txb.splitCoins(txb.gas, [amountMisto]);
      txb.transferObjects([coin], PLATFORM_ADDRESS);
      const res = await signAndExecuteTransaction({ transaction: txb });
      alert(`Support sent! Digest: ${res.digest || "tx"}`);
    } catch (e) {
      console.error(e);
      alert("Failed to send support. Check console for details.");
    } finally {
      setIsSendingSupport(false);
    }
  };

  const handleTagToggle = (passwordId: string, tag: string) => {
    // This would update the password's tags in a real app
    console.log(`Toggle tag "${tag}" for password ${passwordId}`);
  };

  const handleCategorySelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setShowCategoriesModal(false);
    setShowFavorites(false);
  };

  const handleNewPasswordTagToggle = (tag: string) => {
    setNewPasswordData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleEditCategory = (categoryValue: string, currentName: string) => {
    setEditingCategory(categoryValue);
    setEditCategoryName(currentName);
  };

  const handleSaveCategory = () => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.value === editingCategory
          ? { ...cat, label: editCategoryName }
          : cat
      )
    );
    setEditingCategory(null);
    setEditCategoryName("");
  };

  const handleDeleteCategory = (categoryValue: string) => {
    if (categoryValue !== "all") {
      setCategories((prev) =>
        prev.filter((cat) => cat.value !== categoryValue)
      );
      if (selectedCategory === categoryValue) {
        setSelectedCategory("all");
      }
    }
  };

  const handleAddNewCategory = () => {
    const newCategory = {
      value: `custom-${Date.now()}`,
      label: "New Category",
      count: 0,
      icon: "📁",
      color: "bg-gray-100",
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const getSortedTags = (appliedTags: string[]) => {
    const applied = availableTags.filter((tag) => appliedTags.includes(tag));
    const notApplied = availableTags
      .filter((tag) => !appliedTags.includes(tag))
      .sort();
    return [...applied, ...notApplied];
  };

  const getFilteredTags = (searchQuery: string) => {
    return availableTags.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderTags = (tags: string[], maxWidth = 200) => {
    if (tags.length === 0) {
      return <span className="text-xs text-sky-600">Add tags...</span>;
    }

    const visibleTags = [];
    let currentWidth = 0;
    const tagPadding = 16; // approximate padding for each tag
    const ellipsisWidth = 20; // approximate width for "..."

    for (let i = 0; i < tags.length; i++) {
      const tagWidth = tags[i].length * 7 + tagPadding; // approximate character width
      if (
        currentWidth + tagWidth + (i < tags.length - 1 ? ellipsisWidth : 0) <=
        maxWidth
      ) {
        visibleTags.push(tags[i]);
        currentWidth += tagWidth + 4; // 4px gap between tags
      } else {
        break;
      }
    }

    return (
      <>
        {visibleTags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs bg-sky-200 text-sky-800 hover:bg-sky-300"
          >
            {tag}
          </Badge>
        ))}
        {visibleTags.length < tags.length && (
          <span className="text-xs text-sky-600 font-medium">...</span>
        )}
      </>
    );
  };

  const allItemsCategory = categories.find((cat) => cat.value === "all");
  const otherCategories = categories.filter((cat) => cat.value !== "all");

  const handleEditNotes = (passwordId: string, currentNotes: string) => {
    setEditingNotes({ id: passwordId, content: currentNotes });
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    // This would update the password's notes in a real app
    console.log(
      `Saving notes for password ${editingNotes.id}:`,
      editingNotes.content
    );
    setShowNotesModal(false);
    setEditingNotes({ id: "", content: "" });
  };

  const generatePassword = () => {
    const { length, alphabets, numbers, symbols, complexity, useRandom } =
      passwordOptions;

    if (useRandom) {
      // Random generation
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedPassword(result);
      return;
    }

    // Custom generation based on specified counts
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms =
      complexity === "high" ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "!@#$%^&*";

    let password = "";

    // Add required alphabets
    for (let i = 0; i < Math.floor(alphabets / 2); i++) {
      password += upperCase.charAt(
        Math.floor(Math.random() * upperCase.length)
      );
    }
    for (let i = 0; i < Math.ceil(alphabets / 2); i++) {
      password += lowerCase.charAt(
        Math.floor(Math.random() * lowerCase.length)
      );
    }

    // Add required numbers
    for (let i = 0; i < numbers; i++) {
      password += nums.charAt(Math.floor(Math.random() * nums.length));
    }

    // Add required symbols
    for (let i = 0; i < symbols; i++) {
      password += syms.charAt(Math.floor(Math.random() * syms.length));
    }

    // Fill remaining length with random characters
    const allChars = upperCase + lowerCase + nums + syms;
    while (password.length < length) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password
    const shuffled = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    setGeneratedPassword(shuffled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Je-Sui"
                  className="w-10 h-10 rounded-xl object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Je-Sui</h1>
                  <p className="text-sm text-sky-600">
                    Decentralized Password Manager
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search passwords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                  />
                </div>
                <Button
                  variant={showFavorites ? "default" : "outline"}
                  onClick={() => {
                    setShowFavorites(!showFavorites);
                    setSelectedCategory("all");
                  }}
                  className={
                    showFavorites
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "border-pink-200 text-pink-700 hover:bg-pink-50"
                  }
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      showFavorites ? "fill-current" : ""
                    }`}
                  />
                  Favorites
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Connect />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-sky-100 text-sky-700">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      (window as any).dispatchEvent(
                        new CustomEvent("mysten:wallet:disconnect")
                      )
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-sky-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowAddPasswordModal(true)}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Password
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent"
                    onClick={() => setShowPasswordGeneratorModal(true)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Password
                  </Button>
                </CardContent>
              </Card>

              {/* Support the Platform */}
              <Card className="border-sky-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" /> Support Je-Sui
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Send a small tip in SUI to support development.
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={supportAmount}
                      onChange={(e) => setSupportAmount(e.target.value)}
                      className="w-28"
                    />
                    <span className="text-sm text-gray-500">SUI</span>
                  </div>
                  <Button
                    onClick={sendSupport}
                    disabled={!account?.address || isSendingSupport}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    {isSendingSupport ? "Sending..." : "Send Support"}
                  </Button>
                  {!PLATFORM_ADDRESS && (
                    <div className="text-xs text-red-500">
                      Set `VITE_SUPPORT_ADDRESS` in your `.env` to enable.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-sky-100 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900">
                      Categories
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCategoriesModal(true)}
                      className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* All Items - Sticky */}
                  {allItemsCategory && (
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setShowFavorites(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors mt-3 ${
                        selectedCategory === "all" && !showFavorites
                          ? "bg-sky-100 text-sky-700 border border-sky-200"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{allItemsCategory.icon}</span>
                        <span className="font-medium">
                          {allItemsCategory.label}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600"
                      >
                        {allItemsCategory.count}
                      </Badge>
                    </button>
                  )}
                </CardHeader>
                <CardContent
                  className="cursor-pointer"
                  onClick={() => setShowCategoriesModal(true)}
                >
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {otherCategories.slice(0, 7).map((category) => (
                      <button
                        key={category.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category.value);
                          setShowFavorites(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          selectedCategory === category.value && !showFavorites
                            ? "bg-sky-100 text-sky-700 border border-sky-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600"
                        >
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                    {otherCategories.length > 7 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-sky-600">
                          Click to view all categories
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Categories Modal */}
              <Dialog
                open={showCategoriesModal}
                onOpenChange={setShowCategoriesModal}
              >
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle>Select Category</DialogTitle>
                        <DialogDescription>
                          Choose a category to filter your passwords
                        </DialogDescription>
                      </div>
                      <Button
                        onClick={handleAddNewCategory}
                        className="bg-sky-500 hover:bg-sky-600 text-white"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Category
                      </Button>
                    </div>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-3 p-2">
                      {categories.map((category) => (
                        <div key={category.value} className="relative">
                          <button
                            onClick={() => handleCategorySelect(category.value)}
                            className={`w-full flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                              selectedCategory === category.value
                                ? "border-sky-300 bg-sky-50"
                                : "border-gray-200 hover:border-sky-200"
                            } ${category.color}`}
                          >
                            <span className="text-2xl">{category.icon}</span>
                            <span className="text-sm font-medium text-center">
                              {category.label}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </button>

                          {category.value !== "all" && (
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCategory(
                                    category.value,
                                    category.label
                                  );
                                }}
                                className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(category.value);
                                }}
                                className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {editingCategory && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          placeholder="Category name"
                          className="flex-1"
                        />
                        <Button onClick={handleSaveCategory} size="sm">
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(null);
                            setEditCategoryName("");
                          }}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Add Password Modal */}
              <Dialog
                open={showAddPasswordModal}
                onOpenChange={setShowAddPasswordModal}
              >
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-gray-900">
                      ✨ Add New Password ✨
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                      Fill in the cute cards below to save your password
                      securely!
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                      {/* Name Card */}
                      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-pink-700 flex items-center gap-2">
                            🏷️ Site Name
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            placeholder="e.g., MetaMask"
                            value={newPasswordData.name}
                            onChange={(e) =>
                              setNewPasswordData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="border-pink-200 focus:border-pink-400 bg-white/80"
                          />
                        </CardContent>
                      </Card>

                      {/* Password Card */}
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                            🔐 Password
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            value={newPasswordData.password}
                            onChange={(e) =>
                              setNewPasswordData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            className="border-purple-200 focus:border-purple-400 bg-white/80"
                          />
                        </CardContent>
                      </Card>

                      {/* Username Card */}
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            👤 Username
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            placeholder="username@example.com"
                            value={newPasswordData.username}
                            onChange={(e) =>
                              setNewPasswordData((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                            className="border-blue-200 focus:border-blue-400 bg-white/80"
                          />
                        </CardContent>
                      </Card>

                      {/* URL Card */}
                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                            🌐 Website URL
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            placeholder="https://example.com"
                            value={newPasswordData.url}
                            onChange={(e) =>
                              setNewPasswordData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            className="border-green-200 focus:border-green-400 bg-white/80"
                          />
                        </CardContent>
                      </Card>

                      {/* Tags Card */}
                      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
                            🏷️ Tags
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-4 h-4" />
                              <Input
                                placeholder="Search tags..."
                                value={tagSearchQuery}
                                onChange={(e) =>
                                  setTagSearchQuery(e.target.value)
                                }
                                className="pl-10 border-yellow-200 focus:border-yellow-400 bg-white/80"
                              />
                            </div>

                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {getFilteredTags(tagSearchQuery).map((tag) => (
                                <div
                                  key={tag}
                                  onClick={() =>
                                    handleNewPasswordTagToggle(tag)
                                  }
                                  className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm transition-colors ${
                                    newPasswordData.tags.includes(tag)
                                      ? "bg-yellow-200 text-yellow-800 border border-yellow-300"
                                      : "hover:bg-yellow-100 text-yellow-700 border border-transparent"
                                  }`}
                                >
                                  <span>{tag}</span>
                                  {newPasswordData.tags.includes(tag) && (
                                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {newPasswordData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-2 border-t border-yellow-200">
                                {newPasswordData.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                                  >
                                    {tag}
                                    <button
                                      onClick={() =>
                                        handleNewPasswordTagToggle(tag)
                                      }
                                      className="ml-1 hover:text-yellow-900"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Notes Card */}
                      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-sm hover:shadow-md transition-shadow md:col-span-3">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                            📝 Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            placeholder="Add any additional notes here... (e.g., recovery phrases, account numbers, security questions, etc.)"
                            value={newPasswordData.notes}
                            onChange={(e) =>
                              setNewPasswordData((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                            className="border-indigo-200 focus:border-indigo-400 bg-white/80 min-h-[100px] resize-none"
                            rows={4}
                          />
                          <p className="text-xs text-indigo-600 mt-2">
                            💡 Tip: Store recovery phrases, account numbers, or
                            any other important details securely here.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 p-4 border-t bg-white">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddPasswordModal(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Handle save logic here
                        console.log("Saving password:", newPasswordData);
                        setShowAddPasswordModal(false);
                        // Reset form
                        setNewPasswordData({
                          name: "",
                          username: "",
                          password: "",
                          url: "",
                          category: "",
                          tags: [],
                          notes: "",
                        });
                      }}
                      className="bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white px-8"
                    >
                      ✨ Save Password ✨
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Notes Editing Modal */}
              <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      📝 Edit Notes
                    </DialogTitle>
                    <DialogDescription>
                      Update the notes for this password entry
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Textarea
                      value={editingNotes.content}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Add any additional notes here... (e.g., recovery phrases, account numbers, security questions, etc.)"
                      className="min-h-[200px] resize-none"
                      rows={8}
                    />
                    <p className="text-xs text-gray-500">
                      💡 Tip: Store recovery phrases, account numbers, or any
                      other important details securely here.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNotesModal(false);
                        setEditingNotes({ id: "", content: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveNotes}
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      Save Notes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Password Generator Modal */}
              <Dialog
                open={showPasswordGeneratorModal}
                onOpenChange={setShowPasswordGeneratorModal}
              >
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-gray-900">
                      ⚡ Password Generator ⚡
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                      Customize your password settings and generate a secure
                      password
                    </DialogDescription>
                  </DialogHeader>

                  <div className="relative p-8">
                    {/* Generated Password Display */}
                    {generatedPassword && (
                      <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-sky-700">
                              Generated Password:
                            </Label>
                            <div className="mt-1 p-2 bg-white border border-sky-200 rounded font-mono text-sm break-all">
                              {generatedPassword}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPassword)}
                            className="ml-3 border-sky-200 text-sky-700 hover:bg-sky-50"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Central Generate Button */}
                    <div className="flex justify-center mb-8">
                      <Button
                        onClick={generatePassword}
                        className="w-32 h-32 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        ⚡ GEN ⚡
                      </Button>
                    </div>

                    {/* Options arranged around the center */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Top Row */}
                      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-pink-700">
                            🔤 Alphabets
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={passwordOptions.alphabets}
                            onChange={(e) =>
                              setPasswordOptions((prev) => ({
                                ...prev,
                                alphabets: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                            className="border-pink-200 focus:border-pink-400"
                          />
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-blue-700">
                            📏 Length
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            type="number"
                            min="4"
                            max="128"
                            value={passwordOptions.length}
                            onChange={(e) =>
                              setPasswordOptions((prev) => ({
                                ...prev,
                                length: Number.parseInt(e.target.value) || 4,
                              }))
                            }
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-green-700">
                            🔢 Numbers
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={passwordOptions.numbers}
                            onChange={(e) =>
                              setPasswordOptions((prev) => ({
                                ...prev,
                                numbers: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                            className="border-green-200 focus:border-green-400"
                          />
                        </CardContent>
                      </Card>

                      {/* Bottom Row */}
                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-orange-700">
                            🎯 Complexity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Select
                            value={passwordOptions.complexity}
                            onValueChange={(value) =>
                              setPasswordOptions((prev) => ({
                                ...prev,
                                complexity: value,
                              }))
                            }
                          >
                            <SelectTrigger className="border-orange-200 focus:border-orange-400">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-purple-700">
                            🎲 Random
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant={
                              passwordOptions.useRandom ? "default" : "outline"
                            }
                            onClick={() =>
                              setPasswordOptions((prev) => ({
                                ...prev,
                                useRandom: !prev.useRandom,
                              }))
                            }
                            className={
                              passwordOptions.useRandom
                                ? "w-full bg-purple-500 hover:bg-purple-600 text-white"
                                : "w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                            }
                          >
                            {passwordOptions.useRandom ? "ON" : "OFF"}
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-yellow-700">
                            🔣 Symbols
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={passwordOptions.symbols}
                            onChange={(e) =>
                              setPasswordOptions((prev) => ({
                                ...prev,
                                symbols: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                            className="border-yellow-200 focus:border-yellow-400"
                          />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Helper Text */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-500">
                        {passwordOptions.useRandom
                          ? "Random mode: All character types will be mixed randomly"
                          : `Custom mode: ${
                              passwordOptions.alphabets
                            } letters + ${passwordOptions.numbers} numbers + ${
                              passwordOptions.symbols
                            } symbols = ${
                              passwordOptions.alphabets +
                              passwordOptions.numbers +
                              passwordOptions.symbols
                            } chars (Target: ${passwordOptions.length})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 p-4 border-t bg-white">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPasswordGeneratorModal(false);
                        setGeneratedPassword("");
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        if (generatedPassword) {
                          copyToClipboard(generatedPassword);
                        }
                      }}
                      disabled={!generatedPassword}
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      Copy Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Password List */}
              <div className="h-[calc(100vh-200px)] overflow-y-auto space-y-4 pr-2">
                {filteredPasswords.map((password) => (
                  <Card
                    key={password.id}
                    className="border-sky-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent
                      className="p-4"
                      onClick={() => setOpenTagDropdown(null)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-2xl">
                            {password.favicon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {password.name}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  password.strength === "Strong"
                                    ? "border-green-200 text-green-700 bg-green-50"
                                    : "border-orange-200 text-orange-700 bg-orange-50"
                                }`}
                              >
                                {password.strength}
                              </Badge>
                              <div className="relative ml-2">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenTagDropdown(
                                      openTagDropdown === password.id
                                        ? null
                                        : password.id
                                    );
                                  }}
                                  className="flex flex-wrap gap-1 p-2 bg-sky-50 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-100 transition-colors"
                                  style={{
                                    minWidth:
                                      password.tags.length === 0
                                        ? "80px"
                                        : "auto",
                                    maxWidth: "200px",
                                    minHeight: "36px",
                                  }}
                                >
                                  {renderTags(password.tags, 180)}
                                </div>

                                {openTagDropdown === password.id && (
                                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-sky-200 rounded-lg shadow-lg z-10">
                                    <div className="p-3">
                                      <Input
                                        placeholder="Search or add new tag..."
                                        className="mb-2 text-sm border-sky-200 focus:border-sky-400"
                                      />
                                      <div className="max-h-32 overflow-y-auto space-y-1">
                                        {getSortedTags(password.tags).map(
                                          (tag) => (
                                            <div
                                              key={tag}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTagToggle(
                                                  password.id,
                                                  tag
                                                );
                                              }}
                                              className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${
                                                password.tags.includes(tag)
                                                  ? "bg-sky-100 text-sky-800"
                                                  : "hover:bg-gray-50 text-gray-700"
                                              }`}
                                            >
                                              <span>{tag}</span>
                                              {password.tags.includes(tag) && (
                                                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ml-2 ${
                                  password.isFavorite
                                    ? "text-pink-500 hover:text-pink-600"
                                    : "text-gray-400 hover:text-pink-500"
                                }`}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    password.isFavorite ? "fill-current" : ""
                                  }`}
                                />
                              </Button>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-gray-500">
                                    Username:
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(password.username)
                                    }
                                    className="h-5 w-5 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                                <span className="text-sm text-gray-900 font-mono truncate flex-1">
                                  {password.username}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-gray-500">
                                    Password:
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(password.password)
                                    }
                                    className="h-5 w-5 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                                <span className="text-sm text-gray-900 font-mono flex-1">
                                  {showPassword[password.id]
                                    ? password.password
                                    : "••••••••••••"}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    togglePasswordVisibility(password.id)
                                  }
                                  className="h-5 w-5 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                                >
                                  {showPassword[password.id] ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <a
                                    href={password.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-sky-600 hover:text-sky-700 truncate"
                                  >
                                    {password.url}
                                  </a>
                                </div>
                                <span className="text-xs text-gray-500">
                                  Last used {password.lastUsed}
                                </span>
                              </div>

                              {password.notes && (
                                <div
                                  className="mt-2 p-2 bg-gray-50 rounded-md border cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditNotes(
                                      password.id,
                                      password.notes
                                    );
                                  }}
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm text-gray-500 font-medium">
                                      Notes:
                                    </span>
                                    <Edit className="w-3 h-3 text-gray-400 ml-auto" />
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap line-clamp-3">
                                    {password.notes}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Click to edit notes
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredPasswords.length === 0 && (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {showFavorites
                        ? "No favorite passwords found"
                        : "No passwords found"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {showFavorites
                        ? "Mark some passwords as favorites to see them here"
                        : searchQuery
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first password"}
                    </p>
                    <Button
                      onClick={() => setShowAddPasswordModal(true)}
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Password
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Status - Full Width */}
        <Card className="border-sky-100 shadow-sm mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-600" />
              Security Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Vault Health
                  </p>
                  <p className="text-2xl font-bold text-green-700">Excellent</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Weak Passwords
                  </p>
                  <p className="text-2xl font-bold text-orange-700">1</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg border border-sky-200">
                <div>
                  <p className="text-sm text-sky-600 font-medium">
                    Total Passwords
                  </p>
                  <p className="text-2xl font-bold text-sky-700">4</p>
                </div>
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-sky-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Duplicates
                  </p>
                  <p className="text-2xl font-bold text-gray-700">0</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Copy className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
