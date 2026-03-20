"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { VideoCard } from "@/components/video-card";
import { OfferCard } from "@/components/offer-card";
import { AffiliateCard } from "@/components/affiliate-card";
import { BrandCard } from "@/components/brand-card";
import { CompanyCard } from "@/components/company-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  Trash2,
  Video,
  DollarSign,
  Users,
  Building2,
  Building,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { VideoDetailModal } from "@/components/video-detail-modal";
import { BrandDetailModal } from "@/components/brand-detail-modal";
import { CompanyDetailModal } from "@/components/company-detail-modal";
import { FacebookAdCard } from "@/components/facebook-ad-card";
import { useAuth } from "@/contexts/auth-context";
import {
  FavoriteType,
  FavoriteItem,
  FavoriteCountsByType,
  VideoFavoriteData,
  OfferFavoriteData,
  AffiliateFavoriteData,
  BrandFavoriteData,
  CompanyFavoriteData,
} from "@/lib/favorites";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<FavoriteType>("video");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [counts, setCounts] = useState<FavoriteCountsByType & { facebook_ad: number; [key: string]: number }>({
    video: 0,
    offer: 0,
    affiliate: 0,
    brand: 0,
    company: 0,
    facebook_ad: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const {
    getFavorites,
    getFavoritesCounts,
    clearFavoritesByType,
    refreshFavoriteStatus,
    loading: favoritesLoading,
  } = useFavorites();

  const { user, loading: authLoading } = useAuth();

  // Load favorites and counts
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setIsLoading(true);

      // Load counts
      const countsData = await getFavoritesCounts();
      if (countsData) {
        setCounts({ ...countsData, facebook_ad: 0 });
      }

      // Load favorites for active tab
      const favoritesData = await getFavorites(activeTab);
      if (favoritesData) {
        setFavorites(favoritesData.favorites);
      }

      setIsLoading(false);
    };

    loadData();
  }, [activeTab, getFavorites, getFavoritesCounts, user]);

  const handleClearAll = async (type: FavoriteType) => {
    const success = await clearFavoritesByType(type);
    if (success) {
      setFavorites([]);
      setCounts((prev) => ({ ...prev, [type]: 0 }));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as FavoriteType);
  };

  // Selected items for detail modals
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const renderFavoriteCards = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-32 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (favorites.length === 0) {
      const emptyConfig = {
        video: {
          icon: Video,
          title: "Chưa có video yêu thích",
          description: "Bắt đầu lưu video từ trang Tìm kiếm Youtube Ads",
          actionText: "Duyệt Video",
          actionUrl: "/mkt",
        },
        offer: {
          icon: DollarSign,
          title: "Chưa có offer yêu thích",
          description: "Bắt đầu lưu offer từ trang Tìm kiếm Affiliate",
          actionText: "Duyệt Offer",
          actionUrl: "/aff",
        },
        affiliate: {
          icon: Users,
          title: "Chưa có affiliate yêu thích",
          description: "Bắt đầu theo dõi affiliate từ trang Tìm kiếm Affiliate",
          actionText: "Duyệt Affiliate",
          actionUrl: "/aff",
        },
        brand: {
          icon: Building2,
          title: "Chưa có thương hiệu yêu thích",
          description: "Bắt đầu lưu thương hiệu từ trang Tìm kiếm Youtube Ads",
          actionText: "Duyệt Thương hiệu",
          actionUrl: "/mkt",
        },
        company: {
          icon: Building,
          title: "Chưa có doanh nghiệp yêu thích",
          description: "Bắt đầu lưu doanh nghiệp từ trang Tìm kiếm Youtube Ads",
          actionText: "Duyệt Doanh nghiệp",
          actionUrl: "/mkt",
        },
        facebook_ad: {
          icon: Heart,
          title: "Chưa có Facebook Ad yêu thích",
          description: "Bắt đầu lưu quảng cáo Facebook từ trang Facebook Ads Search",
          actionText: "Duyệt Facebook Ads",
          actionUrl: "/facebook-ads-search",
        },
      };

      const config = emptyConfig[activeTab];
      const IconComponent = config.icon;

      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconComponent className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {config.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {config.description}
            </p>
            <Button asChild className="cursor-pointer">
              <a href={config.actionUrl}>
                {config.actionText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {favorites.map((favorite) => {
          switch (favorite.item_type) {
            case "video": {
              const videoData = favorite.item_data as VideoFavoriteData;
              return (
                <VideoCard
                  key={favorite.id}
                  title={videoData.title}
                  channel={videoData.channel}
                  views={videoData.views}
                  ctr={videoData.ctr}
                  date={videoData.date}
                  thumbnail={videoData.thumbnail}
                  url={videoData.url}
                  ytVideoId={videoData.ytVideoId}
                  description={videoData.description}
                  duration={videoData.duration}
                  companyName={videoData.companyName}
                  onClick={() =>
                    setSelectedVideo({
                      title: videoData.title,
                      channel: videoData.channel,
                      views: videoData.views,
                      ctr: videoData.ctr,
                      date: videoData.date,
                      thumbnail: videoData.thumbnail,
                      url: videoData.url,
                      ytVideoId: videoData.ytVideoId || videoData.title,
                      description: videoData.description,
                      duration: videoData.duration,
                      companyName: videoData.companyName,
                    })
                  }
                />
              );
            }
            case "offer": {
              const offerData = favorite.item_data as OfferFavoriteData;
              return (
                <OfferCard
                  key={favorite.id}
                  name={offerData.name}
                  network={offerData.network}
                  vertical={offerData.vertical}
                  payout={offerData.payout}
                  epc={offerData.epc}
                  countries={offerData.countries}
                  totalVideos={offerData.totalVideos}
                />
              );
            }
            case "affiliate": {
              const affiliateData = favorite.item_data as AffiliateFavoriteData;
              return (
                <AffiliateCard
                  key={favorite.id}
                  name={affiliateData.name}
                  channelUrl={affiliateData.channelUrl}
                  totalVideos={affiliateData.totalVideos}
                  totalViews={affiliateData.totalViews}
                  successRate={affiliateData.successRate}
                  topOffers={affiliateData.topOffers}
                  avatar={affiliateData.avatar}
                />
              );
            }
            case "brand": {
              const brandData = favorite.item_data as BrandFavoriteData;
              return (
                <BrandCard
                  key={favorite.id}
                  brandId={favorite.item_id}
                  name={brandData.name || "Unknown Brand"}
                  description={brandData.description || ""}
                  logo={brandData.thumbnail || "/placeholder.svg"}
                  totalAds={brandData.totalCreatives || 0}
                  totalViews={String(brandData.totalViews || 0)}
                  totalSpend={brandData.totalSpend || 0}
                  activeMonths={1} // Default value since not stored in favorites
                  onClick={() => setSelectedBrand(String(favorite.item_id))}
                />
              );
            }
            case "company": {
              const companyData = favorite.item_data as CompanyFavoriteData;
              return (
                <CompanyCard
                  key={favorite.id}
                  name={companyData.name}
                  description={companyData.description}
                  legalName={companyData.legalName}
                  companyId={companyData.companyId}
                  isAffiliate={companyData.isAffiliate}
                  totalVideos={companyData.totalVideos}
                  totalSpend={companyData.totalSpend}
                  onClick={() => {
                    setSelectedCompany(companyData);
                    setSelectedCompanyId(
                      companyData.companyId
                        ? String(companyData.companyId)
                        : String(favorite.item_id)
                    );
                  }}
                />
              );
            }
            case "facebook_ad": {
              // Use FacebookAdCard for facebook_ad type
              const adData = favorite.item_data;
              return (
                <div key={favorite.id} className="flex justify-center items-center">
                  <div className="w-72 h-72">
                    <FacebookAdCard ad={adData} />
                  </div>
                </div>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card className="max-w-md mx-auto border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white mb-4">
                <LogIn className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Đăng nhập để xem yêu thích
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Bạn cần đăng nhập để quản lý danh sách yêu thích của mình
              </p>
              <Button asChild className="cursor-pointer">
                <a href="/login">
                  Đăng nhập
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-700 py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
              <Heart className="h-4 w-4" />
              Yêu thích của tôi
            </div>
            <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
              Danh sách yêu thích
            </h1>
            <p className="text-base text-white/80 max-w-xl mx-auto">
              Theo dõi và quản lý ads, thương hiệu và doanh nghiệp đã lưu
            </p>
          </div>
        </div>
      </section>

      <main className="container py-8 -mt-6 relative z-20">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Video</p>
                <p className="text-2xl font-bold text-foreground">
                  {counts.video}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thương hiệu</p>
                <p className="text-2xl font-bold text-foreground">
                  {counts.brand}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doanh nghiệp</p>
                <p className="text-2xl font-bold text-foreground">
                  {counts.company}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Facebook Ads</p>
                <p className="text-2xl font-bold text-foreground">
                  {counts.facebook_ad}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-6 flex w-full overflow-x-auto whitespace-nowrap custom-scroll">
            <TabsTrigger value="video" className=" cursor-pointer">
              <Video className="mr-2 h-4 w-4" />
              Video yêu thích
            </TabsTrigger>
            {/* <TabsTrigger value="offer">
              <DollarSign className="mr-2 h-4 w-4" />
              Offer yêu thích
            </TabsTrigger>
            <TabsTrigger value="affiliate">
              <Users className="mr-2 h-4 w-4" />
              Affiliate yêu thích
            </TabsTrigger> */}
            <TabsTrigger value="brand" className="cursor-pointer">
              <Building2 className="mr-2 h-4 w-4" />
              Thương hiệu yêu thích
            </TabsTrigger>
            <TabsTrigger value="company" className="cursor-pointer">
              <Building className="mr-2 h-4 w-4" />
              Doanh nghiệp yêu thích
            </TabsTrigger>
            <TabsTrigger value="facebook_ad" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              Facebook Ads yêu thích
            </TabsTrigger>
          </TabsList>

          {[
            "video",
            "offer",
            "affiliate",
            "brand",
            "company",
            "facebook_ad",
          ].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {counts[type] > 0 && (
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {counts[type]} mục đã lưu
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa tất cả
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="lg:max-w-[50%]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc muốn xóa tất cả {type} yêu thích? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleClearAll(type as FavoriteType)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Xóa tất cả
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              {renderFavoriteCards()}
            </TabsContent>
          ))}
        </Tabs>
        <VideoDetailModal
          open={!!selectedVideo}
          onOpenChange={(open) => {
            if (!open) setSelectedVideo(null);
          }}
          video={
            selectedVideo || {
              title: "",
              channel: "",
              views: "0",
              ctr: "0%",
              date: "",
              thumbnail: "",
              url: "",
              ytVideoId: "",
              description: "",
              duration: "",
              companyName: "",
            }
          }
          onClose={async (videoId: string) => {
            // Refresh favorite status for the video when modal closes
            // await refreshFavoriteStatus('video', videoId)
          }}
        />

        <BrandDetailModal
          open={!!selectedBrand}
          onOpenChange={(open) => {
            if (!open) setSelectedBrand(null);
          }}
          brandId={selectedBrand}
          onClose={async (brandId: string) => {
            // await refreshFavoriteStatus('brand', brandId)
          }}
        />

        <CompanyDetailModal
          open={!!selectedCompanyId}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedCompany(null);
              setSelectedCompanyId(null);
            }
          }}
          companyId={selectedCompanyId}
          company={selectedCompany}
          onClose={async (companyId: string) => {
            // await refreshFavoriteStatus('company', companyId)
          }}
        />
      </main>

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  );
}
