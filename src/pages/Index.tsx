import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('standard');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [releaseStep, setReleaseStep] = useState(1);
  const [releaseForm, setReleaseForm] = useState({
    title: '',
    artists: [''],
    genre: '',
    subgenre: '',
    upc: '',
    releaseDate: '',
    autoDate: false,
    preorder: false,
    availability: 'cis',
  });
  const [tracks, setTracks] = useState([{ title: '', subtitle: '', isFocus: false }]);
  const [catalogFilter, setCatalogFilter] = useState('all');

  const mockReleases = [
    { id: 1, title: 'Летний альбом', artist: 'Артист 1', status: 'published', date: '2025-01-15', cover: '🎵' },
    { id: 2, title: 'Новый EP', artist: 'Артист 2', status: 'moderation', date: '2025-02-01', cover: '🎧' },
    { id: 3, title: 'Сингл', artist: 'Артист 3', status: 'draft', date: '2025-03-10', cover: '🎤' },
  ];

  const mockNews = [
    { id: 1, title: 'Обновление платформы v2.0', type: 'service', date: '2025-11-08', likes: 24 },
    { id: 2, title: 'Артист 1 попал в топ-50 Яндекс.Музыки', type: 'artist', date: '2025-11-07', likes: 156 },
    { id: 3, title: 'Новые функции модерации', type: 'service', date: '2025-11-05', likes: 42 },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { label: 'Черновик', variant: 'secondary' as const },
      new: { label: 'Новый', variant: 'default' as const },
      moderation: { label: 'На модерации', variant: 'default' as const },
      rejected: { label: 'Отклонён', variant: 'destructive' as const },
      published: { label: 'Опубликован', variant: 'default' as const },
      deleted: { label: 'Удалён', variant: 'secondary' as const },
      blocked: { label: 'Заблокирован', variant: 'destructive' as const },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const addTrack = () => {
    setTracks([...tracks, { title: '', subtitle: '', isFocus: false }]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Music" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">MusicHub</CardTitle>
            <CardDescription>Платформа для дистрибуции музыки</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Логин</Label>
                  <Input id="login" placeholder="Ваш логин" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full" onClick={() => {
                  setIsAuthenticated(true);
                  setUserRole('admin');
                }}>
                  Войти
                </Button>
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя</Label>
                    <Input id="firstName" placeholder="Иван" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input id="lastName" placeholder="Иванов" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regLogin">Логин</Label>
                  <Input id="regLogin" placeholder="ivan_music" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Псевдоним</Label>
                  <Input id="nickname" placeholder="DJ Ivan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Почта</Label>
                  <Input id="email" type="email" placeholder="ivan@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword">Пароль</Label>
                  <Input id="regPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full" onClick={() => setIsAuthenticated(true)}>
                  Создать аккаунт
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Music" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">MusicHub</h1>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard', adminOnly: false },
              { id: 'release', label: 'Новый релиз', icon: 'Upload', adminOnly: false },
              { id: 'catalog', label: 'Каталог', icon: 'Disc3', adminOnly: false },
              { id: 'news', label: 'Новости', icon: 'Newspaper', adminOnly: false },
              { id: 'profile', label: 'Профиль', icon: 'User', adminOnly: false },
              { id: 'support', label: 'Поддержка', icon: 'MessageCircle', adminOnly: false },
              { id: 'admin', label: 'Админ-панель', icon: 'Shield', adminOnly: true },
            ].filter(item => !item.adminOnly || userRole === 'admin').map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon name={item.icon as any} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Добро пожаловать! 👋</h2>
                  <p className="text-muted-foreground mt-1">Управляйте своими релизами</p>
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-white">DJ</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Disc3" size={20} className="text-primary" />
                      Релизов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">12</div>
                    <p className="text-sm text-muted-foreground mt-1">Всего опубликовано</p>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-secondary" />
                      Прослушиваний
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">45.2K</div>
                    <p className="text-sm text-muted-foreground mt-1">За последний месяц</p>
                  </CardContent>
                </Card>

                <Card className="hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Wallet" size={20} className="text-accent" />
                      Баланс
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">₽8,450</div>
                    <p className="text-sm text-muted-foreground mt-1">Доступно к выводу</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Последние релизы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReleases.slice(0, 3).map((release) => (
                      <div key={release.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                          {release.cover}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{release.title}</h4>
                          <p className="text-sm text-muted-foreground">{release.artist}</p>
                        </div>
                        <Badge {...getStatusBadge(release.status)}>{getStatusBadge(release.status).label}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'release' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Отправка релиза</h2>
                <p className="text-muted-foreground mt-1">Заполните информацию о вашем релизе</p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                            releaseStep >= step ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step}
                        </div>
                        {step < 4 && <div className={`w-20 h-1 mx-2 ${releaseStep > step ? 'bg-primary' : 'bg-muted'}`} />}
                      </div>
                    ))}
                  </div>
                  <Progress value={(releaseStep / 4) * 100} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {releaseStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Информация о релизе</h3>
                      <div className="space-y-2">
                        <Label htmlFor="releaseTitle">Название релиза</Label>
                        <Input
                          id="releaseTitle"
                          placeholder="Мой новый альбом"
                          value={releaseForm.title}
                          onChange={(e) => setReleaseForm({ ...releaseForm, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Обложка (1500-3000px, 72 dpi, до 20МБ)</Label>
                        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Нажмите или перетащите файл</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Жанр</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите жанр" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pop">Поп</SelectItem>
                              <SelectItem value="rock">Рок</SelectItem>
                              <SelectItem value="hip-hop">Хип-хоп</SelectItem>
                              <SelectItem value="electronic">Электронная</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Поджанр</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите поджанр" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indie-pop">Инди-поп</SelectItem>
                              <SelectItem value="alt-rock">Альтернативный рок</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="autoDate" />
                        <Label htmlFor="autoDate">Дата релиза по усмотрению менеджера</Label>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setReleaseStep(2)} className="flex-1">
                          Далее
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {releaseStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Трек-лист</h3>
                      {tracks.map((track, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold flex items-center gap-2">
                                Трек {index + 1}
                                {track.isFocus && <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />}
                              </h4>
                              <Button variant="ghost" size="sm" onClick={() => removeTrack(index)}>
                                <Icon name="X" size={16} />
                              </Button>
                            </div>
                            <Input placeholder="Название трека" />
                            <Input placeholder="Подзаголовок (опционально)" className="text-muted-foreground" />
                            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                              <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-1" />
                              <p className="text-sm text-muted-foreground">WAV до 1ГБ</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button variant="outline" onClick={addTrack} className="w-full">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить трек
                      </Button>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setReleaseStep(1)} className="flex-1">
                          <Icon name="ArrowLeft" size={16} className="mr-2" />
                          Назад
                        </Button>
                        <Button onClick={() => setReleaseStep(3)} className="flex-1">
                          Далее
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {releaseStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Дополнительные услуги</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Приоритетная подача в питчинг', price: '₽500' },
                          { label: 'Консультация по продвижению', price: '₽1,000' },
                          { label: 'Синхронизация текста', price: '₽300' },
                          { label: 'Выделение релиза в новостях', price: '₽750' },
                          { label: 'Получение пресейв-ссылки', price: '₽200' },
                          { label: 'Получение промо-ролика', price: '₽1,500/трек' },
                        ].map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors">
                            <div className="flex items-center gap-3">
                              <Switch id={`service-${index}`} />
                              <Label htmlFor={`service-${index}`} className="cursor-pointer">{service.label}</Label>
                            </div>
                            <span className="font-semibold text-primary">{service.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setReleaseStep(2)} className="flex-1">
                          <Icon name="ArrowLeft" size={16} className="mr-2" />
                          Назад
                        </Button>
                        <Button onClick={() => setReleaseStep(4)} className="flex-1">
                          Далее
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {releaseStep === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Проверка и отправка</h3>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-primary/20 rounded-lg flex items-center justify-center text-4xl">
                              🎵
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold">{releaseForm.title || 'Название релиза'}</h4>
                              <p className="text-muted-foreground">Исполнитель</p>
                              <div className="flex gap-2 mt-2">
                                <Badge>Поп</Badge>
                                <Badge variant="outline">Инди-поп</Badge>
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <h5 className="font-semibold mb-2">Трек-лист ({tracks.length} треков)</h5>
                            {tracks.map((_, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {index + 1}. Трек {index + 1}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setReleaseStep(3)} className="flex-1">
                          <Icon name="ArrowLeft" size={16} className="mr-2" />
                          Назад
                        </Button>
                        <Button className="flex-1">
                          <Icon name="Send" size={16} className="mr-2" />
                          Отправить на модерацию
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'catalog' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Каталог релизов</h2>
                  <p className="text-muted-foreground mt-1">Управляйте своими релизами</p>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Поиск..." className="w-64" />
                  <Select value={catalogFilter} onValueChange={setCatalogFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="moderation">Модерация</SelectItem>
                      <SelectItem value="published">Опубликован</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockReleases.map((release) => (
                  <Card key={release.id} className="hover-scale cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="w-full h-48 bg-primary/20 rounded-lg flex items-center justify-center text-6xl mb-4">
                        {release.cover}
                      </div>
                      <h3 className="font-bold text-lg">{release.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{release.artist}</p>
                      <div className="flex justify-between items-center">
                        <Badge {...getStatusBadge(release.status)}>{getStatusBadge(release.status).label}</Badge>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'news' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Новости</h2>
                <p className="text-muted-foreground mt-1">Последние обновления и события</p>
              </div>

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Все новости</TabsTrigger>
                  <TabsTrigger value="service">Сервис</TabsTrigger>
                  <TabsTrigger value="artists">Артисты</TabsTrigger>
                  <TabsTrigger value="liked">Лайкнутое</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {mockNews.map((news) => (
                    <Card key={news.id} className="hover-scale">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={news.type === 'service' ? 'default' : 'secondary'}>
                                {news.type === 'service' ? 'Сервис' : 'Артисты'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{news.date}</span>
                            </div>
                            <h3 className="font-bold text-lg">{news.title}</h3>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Icon name="Heart" size={16} className="mr-1" />
                            {news.likes}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Профиль</h2>
                <p className="text-muted-foreground mt-1">Управление настройками аккаунта</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarFallback className="bg-primary text-white text-2xl">DJ</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Изменить аватар</Button>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Имя</Label>
                        <Input defaultValue="Иван" />
                      </div>
                      <div className="space-y-2">
                        <Label>Фамилия</Label>
                        <Input defaultValue="Иванов" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Псевдоним</Label>
                      <Input defaultValue="DJ Ivan" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue="ivan@example.com" />
                    </div>
                    <Button>Сохранить изменения</Button>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Статус аккаунта</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-4">Стандарт</Badge>
                      <p className="text-sm text-muted-foreground mb-4">Базовая ставка роялти</p>
                      <Button className="w-full" variant="secondary">
                        <Icon name="Crown" size={16} className="mr-2" />
                        Перейти на Премиум
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Баланс</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">₽8,450</div>
                      <p className="text-sm text-muted-foreground mb-4">Доступно к выводу</p>
                      <Button className="w-full">
                        <Icon name="CreditCard" size={16} className="mr-2" />
                        Вывести средства
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'support' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Служба поддержки</h2>
                <p className="text-muted-foreground mt-1">Создайте обращение для решения вопроса</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Новое обращение</CardTitle>
                  <CardDescription>Опишите вашу проблему или вопрос</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Тема обращения</Label>
                    <Input placeholder="Например: Проблема с загрузкой трека" />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание (до 300 символов)</Label>
                    <Textarea
                      placeholder="Подробно опишите проблему..."
                      className="min-h-32"
                      maxLength={300}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Прикрепить изображение (до 1МБ)</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Нажмите или перетащите файл</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить обращение
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'admin' && userRole === 'admin' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Админ-панель 🛡️</h2>
                <p className="text-muted-foreground mt-1">Управление платформой</p>
              </div>

              <Tabs defaultValue="users">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="users">Пользователи</TabsTrigger>
                  <TabsTrigger value="moderation">Модерация</TabsTrigger>
                  <TabsTrigger value="tickets">Тикеты</TabsTrigger>
                  <TabsTrigger value="news-admin">Новости</TabsTrigger>
                  <TabsTrigger value="stats">Статистика</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Управление пользователями</CardTitle>
                        <Input placeholder="Поиск пользователя..." className="w-64" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { id: 1, name: 'Иван Иванов', nickname: 'DJ Ivan', email: 'ivan@example.com', status: 'standard', blocked: false },
                          { id: 2, name: 'Петр Петров', nickname: 'MC Pete', email: 'pete@example.com', status: 'premium', blocked: false },
                          { id: 3, name: 'Анна Смирнова', nickname: 'Anna Music', email: 'anna@example.com', status: 'label_artist', blocked: true },
                        ].map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback className="bg-primary text-white">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{user.name}</h4>
                                <p className="text-sm text-muted-foreground">{user.nickname} • {user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select defaultValue={user.status}>
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Администратор</SelectItem>
                                  <SelectItem value="label_artist">Артист лейбла</SelectItem>
                                  <SelectItem value="premium">Премиум</SelectItem>
                                  <SelectItem value="standard">Стандарт</SelectItem>
                                </SelectContent>
                              </Select>
                              {user.blocked ? (
                                <Button variant="outline" size="sm">
                                  <Icon name="Unlock" size={16} className="mr-1" />
                                  Разблокировать
                                </Button>
                              ) : (
                                <Button variant="destructive" size="sm">
                                  <Icon name="Lock" size={16} className="mr-1" />
                                  Заблокировать
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Icon name="Key" size={16} />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="moderation" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Релизы на модерации</CardTitle>
                      <CardDescription>Проверьте и одобрите новые релизы</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { id: 1, title: 'Новый EP', artist: 'Артист 2', tracks: 5, submitted: '2025-11-08' },
                          { id: 2, title: 'Летний сингл', artist: 'DJ Ivan', tracks: 1, submitted: '2025-11-07' },
                        ].map((release) => (
                          <Card key={release.id}>
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                  <div className="w-20 h-20 bg-primary/20 rounded-lg flex items-center justify-center text-3xl">
                                    🎧
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg">{release.title}</h4>
                                    <p className="text-sm text-muted-foreground">{release.artist}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {release.tracks} треков • Отправлено {release.submitted}
                                    </p>
                                  </div>
                                </div>
                                <Badge>На модерации</Badge>
                              </div>
                              <Separator className="my-4" />
                              <div className="flex gap-2">
                                <Button className="flex-1">
                                  <Icon name="Check" size={16} className="mr-2" />
                                  Одобрить
                                </Button>
                                <Button variant="destructive" className="flex-1">
                                  <Icon name="X" size={16} className="mr-2" />
                                  Отклонить
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tickets" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Обращения пользователей</CardTitle>
                      <CardDescription>Ответьте на запросы поддержки</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { id: 1, user: 'Иван Иванов', subject: 'Проблема с загрузкой трека', status: 'open', created: '2025-11-09' },
                          { id: 2, user: 'Петр Петров', subject: 'Вопрос о роялти', status: 'in_progress', created: '2025-11-08' },
                        ].map((ticket) => (
                          <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{ticket.subject}</h4>
                                <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                                  {ticket.status === 'open' ? 'Новое' : 'В работе'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{ticket.user} • {ticket.created}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Icon name="MessageSquare" size={16} className="mr-2" />
                              Ответить
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="news-admin" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Создать новость</CardTitle>
                        <Button>
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить новость
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Заголовок</Label>
                        <Input placeholder="Заголовок новости" />
                      </div>
                      <div className="space-y-2">
                        <Label>Содержание</Label>
                        <Textarea placeholder="Текст новости..." className="min-h-32" />
                      </div>
                      <div className="space-y-2">
                        <Label>Тип новости</Label>
                        <Select defaultValue="service">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="service">Новости сервиса</SelectItem>
                            <SelectItem value="artist">Новости артистов</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        <Icon name="Send" size={16} className="mr-2" />
                        Опубликовать
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon name="Users" size={20} className="text-primary" />
                          Пользователей
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">248</div>
                        <p className="text-sm text-muted-foreground mt-1">+12 за неделю</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon name="Disc3" size={20} className="text-secondary" />
                          Релизов
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">1,542</div>
                        <p className="text-sm text-muted-foreground mt-1">+34 за неделю</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon name="Clock" size={20} className="text-accent" />
                          На модерации
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">8</div>
                        <p className="text-sm text-muted-foreground mt-1">Требуют проверки</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;